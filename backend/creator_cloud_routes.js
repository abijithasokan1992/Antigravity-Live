const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const storage = require('./services/storage_adapter');
const auditLogger = require('./services/audit_logger');

const supabaseUrl = process.env.SUPABASE_URL || 'https://mock.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware to mock RBAC user
const requireCreatorAuth = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    req.user = { id: 'auth-user-id', organization_id: 'mock-org-id', email: 'director@studio.com' }; // Mocked for execution
    next();
};

/**
 * POST /v1/projects
 * Initialize a new project for an organization.
 */
router.post('/api/v1/projects', requireCreatorAuth, async (req, res) => {
    try {
        const { name } = req.body;
        
        if (!name) {
            return res.status(400).json({ success: false, error: "Project name is required." });
        }

        const { data, error } = await supabase
            .from('projects')
            .insert([{
                name,
                organization_id: req.user.organization_id,
                status: 'DRAFT'
            }])
            .select()
            .single();

        if (error) throw error;
        
        return res.status(201).json({ success: true, project: data });
    } catch (err) {
        console.error('[Creator Cloud] Error creating project:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * GET /v1/projects
 * List projects for a user based on RBAC membership.
 */
router.get('/api/v1/projects', requireCreatorAuth, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('organization_id', req.user.organization_id);

        if (error) throw error;
        
        return res.status(200).json({ success: true, projects: data });
    } catch (err) {
        console.error('[Creator Cloud] Error fetching projects:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * POST /v1/ingest-sessions
 * Initialize a new upload session, returns a secure presigned upload URL.
 */
router.post('/api/v1/ingest-sessions', requireCreatorAuth, async (req, res) => {
    try {
        const { asset_type, filename, card_id } = req.body;
        
        storage.setProviderForAsset(asset_type);
        const objectKey = `ingest/${req.user.organization_id}/${card_id || 'unassigned'}/${filename}`;
        
        const presignedData = await storage.generatePresignedUploadUrl(objectKey, 'application/octet-stream');
        
        return res.status(200).json({ 
            success: true, 
            session: presignedData 
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * PUT /v1/ingest-sessions/:id/chunk
 * Receive a chunk payload.
 */
router.put('/api/v1/ingest-sessions/:id/chunk', requireCreatorAuth, async (req, res) => {
    try {
        const sessionId = req.params.id;
        const chunkIndex = req.query.partNumber;
        
        // Mock processing the chunk stream
        console.log(`[Backend] Received chunk ${chunkIndex} for session ${sessionId}`);

        return res.status(200).json({
            success: true,
            partNumber: chunkIndex,
            eTag: `mock-etag-${chunkIndex}`
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * POST /v1/ingest-sessions/:id/complete
 * Complete multipart upload, compare checksums, mark Safe To Format.
 */
router.post('/api/v1/ingest-sessions/:id/complete', requireCreatorAuth, async (req, res) => {
    try {
        const sessionId = req.params.id;
        const { parts, client_checksum, card_id } = req.body;

        // 1. Assemble chunks in cloud storage
        const cloudResult = await storage.completeMultipartUpload(sessionId, parts);
        
        // 2. Hash Verification (Cloud vs Client)
        const isMatch = cloudResult.cloudChecksum === client_checksum;
        const verification_status = isMatch ? 'SAFE TO FORMAT' : 'MISMATCH';

        // 3. Update Camera Card status in DB
        if (card_id) {
            await supabase
                .from('camera_cards')
                .update({ verification_status, ingest_status: 'COMPLETED' })
                .eq('card_id', card_id);
        }

        // 4. Audit Log
        await auditLogger.log(
            req.user.id,
            'VERIFY_CARD_INGEST',
            'CAMERA_CARD',
            card_id || sessionId
        );

        // Async dispatch for Jobs (Proxy, QC) happens here
        
        return res.status(200).json({
            success: true,
            verification_status,
            message: isMatch ? 'Card is safe to format.' : 'Checksum mismatch detected.'
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * GET /v1/jobs/:id
 * Poll asynchronous job status (proxy generation, QC).
 */
router.get('/api/v1/jobs/:id', requireCreatorAuth, async (req, res) => {
    try {
        const jobId = req.params.id;
        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('job_id', jobId)
            .single();

        if (error) {
            // If mocking, return a mocked running job response
            return res.status(200).json({
                success: true,
                job: {
                    job_id: jobId,
                    job_type: 'PROXY_GENERATION',
                    status: 'RUNNING',
                    progress_percentage: 65
                }
            });
        }
        
        return res.status(200).json({ success: true, job: data });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * GET /v1/assets
 * Fetch reviewable proxies for a project.
 */
router.get('/api/v1/assets', requireCreatorAuth, async (req, res) => {
    try {
        const { project_id, asset_type } = req.query;
        if (!project_id) {
            return res.status(400).json({ success: false, error: 'project_id is required' });
        }

        let query = supabase.from('assets').select('*').eq('project_id', project_id);
        if (asset_type) {
            query = query.eq('asset_type', asset_type);
        }

        const { data, error } = await query;
        if (error) {
            // Mock response if DB empty
            return res.status(200).json({
                success: true,
                assets: [
                    {
                        asset_id: 'mock-asset-1',
                        asset_type: 'PROXY',
                        storage_object_key: 'proxies/mock-org/vid1.mp4',
                        status: 'READY'
                    }
                ]
            });
        }
        
        return res.status(200).json({ success: true, assets: data });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * POST /v1/deliveries
 * Generate a secure Editor Delivery Package.
 */
router.post('/api/v1/deliveries', requireCreatorAuth, async (req, res) => {
    try {
        const { project_id, target_user_id } = req.body;
        if (!project_id) {
            return res.status(400).json({ success: false, error: 'project_id is required' });
        }

        // Mock bundling the delivery (e.g. zipping proxies on serverless)
        console.log(`[Packager] Bundling delivery for project ${project_id}...`);
        const deliveryKey = `deliveries/${req.user.organization_id}/${project_id}/editorial_package.zip`;
        
        // Generate a 48-hour secure expiring link
        const downloadLink = await storage.generateSecureDownloadLink(deliveryKey, 48);

        // Enforce Audit Logging
        await auditLogger.log(
            req.user.id,
            'GENERATE_DELIVERY',
            'PROJECT',
            project_id
        );

        return res.status(200).json({
            success: true,
            delivery: {
                package_name: 'editorial_package.zip',
                size_bytes: 140000000000, // 140GB
                expires_in_hours: 48,
                checksum: 'mock-sha256-delivery-hash',
                download_url: downloadLink
            }
        });
    } catch (err) {
        console.error('[Creator Cloud] Delivery error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
