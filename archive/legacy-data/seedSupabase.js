require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mock.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'mock-key';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const DATA_DIR = path.join(__dirname, '..');

async function seed() {
    console.log("Starting 12-Table StreamVista v3 Supabase Seeding...");

    // 1. Clean & Seed Parties & Auth Identities
    const usersRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'accounts_user.json'), 'utf8'));
    let parties = [];
    let authIdentities = [];
    let seenEmails = new Set();
    
    for (let u of usersRaw) {
        if (['test1@gmail.com', 'videodrive@videodrive.com', 'admin@gmail.com'].includes(u.email)) continue;
        if (u.phone && u.phone.includes('@')) {
            u.email = u.phone;
        }
        if (!u.email || seenEmails.has(u.email)) continue;
        seenEmails.add(u.email);
        
        let phone = u.phone ? u.phone.replace(/[\s+]/g, '') : '';
        if (phone.toLowerCase() === 'admin') phone = '';
        
        const legalName = u.company_name || (`${u.first_name || ''} ${u.last_name || ''}`).trim() || 'Unknown';
        
        parties.push({
            id: u.id,
            is_organization: !!u.company_name,
            legal_name: legalName,
            display_name: legalName,
            email: u.email,
            phone: phone
        });
        
        authIdentities.push({
            party_id: u.id,
            provider: 'email_link',
            identifier: u.email
        });
    }

    if (parties.length > 0) {
        const { error } = await supabase.from('party').upsert(parties);
        if (error) console.error("Party seed error:", error);
        else console.log(`Seeded ${parties.length} parties.`);
    }
    
    if (authIdentities.length > 0) {
        const { error } = await supabase.from('auth_identity').upsert(authIdentities, { onConflict: 'provider,identifier' });
        if (error) console.error("Auth Identity seed error:", error);
        else console.log(`Seeded ${authIdentities.length} auth identities.`);
    }

    // 2. Titles, Draft State, and Assets
    const filmsRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'films_film.json'), 'utf8'));
    let titles = [];
    let assets = [];
    let rights = [];
    
    for (let f of filmsRaw) {
        titles.push({
            id: f.id,
            owner_party_id: f.uploaded_by_id || 1,
            title_name: f.title || 'Untitled',
            type: 'feature_film',
            runtime_seconds: f.duration ? parseInt(f.duration) : null,
            original_language: f.language,
            production_year: f.release_date ? parseInt(f.release_date.substring(0,4)) : null,
            status: 'published'
        });

        ['video_file', 'poster', 'trailer'].forEach(field => {
            if (f[field]) {
                try {
                    const parsed = new URL(f[field]);
                    assets.push({
                        title_id: f.id,
                        asset_type: field === 'video_file' ? 'master_video' : field === 'poster' ? 'artwork' : 'trailer',
                        storage_provider: parsed.hostname.includes('amazonaws') ? 'aws_s3' : 'oracle_cloud',
                        bucket_name: parsed.hostname.split('.')[0],
                        object_key: parsed.pathname.substring(1)
                    });
                } catch (e) {}
            }
        });
    }
    
    // Drafts (absorb into title table)
    const draftsRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'films_filmdraft.json'), 'utf8'));
    const validDrafts = draftsRaw.filter(d => d.title && d.uploaded_by_id);
    for (let d of validDrafts) {
        titles.push({
            id: d.id, // using draft id for uniqueness in this mock, normally title id
            owner_party_id: d.uploaded_by_id,
            title_name: d.title || 'Untitled Draft',
            type: 'feature_film',
            status: 'draft',
            draft_state: d
        });
    }

    if (titles.length > 0) {
        const { error } = await supabase.from('title').upsert(titles);
        if (error) console.error("Title seed error:", error);
        else console.log(`Seeded ${titles.length} titles (including absorbed drafts).`);
        
        // Auto-generate rights_avails for ALL titles to make them "ready for licensing" and visible on the CRM board
        for (let t of titles) {
            rights.push({
                title_id: t.id,
                territory_iso: 'WLD', // Worldwide
                media_type: 'avod',   // Target FAST/AVOD
                is_exclusive: false,
                window_start: new Date().toISOString().split('T')[0],
                is_available: true
            });
        }
        if (rights.length > 0) {
            const { error: rightsError } = await supabase.from('rights_avails').upsert(rights);
            if (rightsError) console.error("Rights Avails seed error:", rightsError);
            else console.log(`Seeded ${rights.length} rights avails records.`);
        }
    }
    
    if (assets.length > 0) {
        const { error } = await supabase.from('media_asset').insert(assets);
        if (error) console.error("Asset seed error:", error);
        else console.log(`Seeded ${assets.length} media assets.`);
    }

    // 3. Buyer Mappings, Threads & Messages
    const mappingsRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'films_filmbuyermapping.json'), 'utf8'));
    let buyerMappings = [];
    let threads = [];
    let messages = [];

    for (let m of mappingsRaw) {
        buyerMappings.push({
            id: m.id,
            title_id: m.film_id,
            buyer_party_id: m.buyer_id,
            mapped_by_party_id: m.mapped_by_id || 1,
            status: 'active'
        });
        
        threads.push({
            id: m.id,
            title_id: m.film_id,
            buyer_party_id: m.buyer_id,
            subject: 'Deal Introduction'
        });
        
        if (m.notes) {
            messages.push({
                thread_id: m.id,
                sender_party_id: m.mapped_by_id || 1,
                body: m.notes
            });
        }
    }

    if (buyerMappings.length > 0) {
        const { error } = await supabase.from('buyer_mapping').upsert(buyerMappings);
        if (error) console.error("Buyer mapping seed error:", error);
        else console.log(`Seeded ${buyerMappings.length} buyer mappings.`);
    }
    
    if (threads.length > 0) {
        const { error } = await supabase.from('thread').upsert(threads);
        if (error) console.error("Thread seed error:", error);
        else console.log(`Seeded ${threads.length} threads.`);
    }
    
    if (messages.length > 0) {
        const { error } = await supabase.from('message').insert(messages);
        if (error) console.error("Message seed error:", error);
        else console.log(`Seeded ${messages.length} messages.`);
    }

    console.log("Seeding complete for 12-Table Schema!");
}

seed();
