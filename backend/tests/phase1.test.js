const request = require('supertest');

jest.mock('@supabase/supabase-js', () => {
  let lastId = null;
  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    eq: jest.fn().mockImplementation((key, val) => {
      if (key === 'id') lastId = val;
      return mockSupabase;
    }),
    maybeSingle: jest.fn().mockImplementation(() => {
      if (lastId === 'non-existent-id') return Promise.resolve({ data: null, error: null });
      return Promise.resolve({ data: { id: '123e4567-e89b-12d3-a456-426614174000' }, error: null });
    }),
    single: jest.fn().mockResolvedValue({ data: { id: 'msg1', thread_id: '987f6543-e21b-12d3-a456-426614174000', body: 'Rights avail inquiry regarding OTT non-exclusive sub-license.', created_at: '2026-07-20T00:00:00Z' }, error: null })
  };
  return { createClient: () => mockSupabase };
});

const app = require('../server'); // Path to your main Express app

describe('Phase 1 Integration Tests (/api/v1/phase1)', () => {
  let authToken;
  const validTitleId = '123e4567-e89b-12d3-a456-426614174000';
  const invalidTitleId = 'non-existent-id';
  const validThreadId = '987f6543-e21b-12d3-a456-426614174000';

  beforeAll(async () => {
    // Acquire a test authentication token (or mock auth session)
    // Replace with your test auth route or helper token generator
    authToken = 'Bearer test-valid-jwt-token';
  });

  /* =========================================================================
     1. GET /api/v1/phase1/pipeline
     ========================================================================= */
  describe('GET /api/v1/phase1/pipeline', () => {
    it('should fail with 401 Unauthorized if no auth token is provided', async () => {
      const response = await request(app)
        .get('/api/v1/phase1/pipeline');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 200 OK and a 7-column pipeline structure when authenticated', async () => {
      const response = await request(app)
        .get('/api/v1/phase1/pipeline')
        .set('Authorization', authToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('columns');
      expect(Array.isArray(response.body.columns)).toBe(true);
      expect(response.body.columns).toHaveLength(7); // Must dynamically calculate 7 states

      // Assert structure of each pipeline column
      response.body.columns.forEach((col) => {
        expect(col).toHaveProperty('id');
        expect(col).toHaveProperty('title');
        expect(col).toHaveProperty('items');
        expect(Array.isArray(col.items)).toBe(true);
      });
    });
  });

  /* =========================================================================
     2. GET /api/v1/phase1/titles/:id/rights
     ========================================================================= */
  describe('GET /api/v1/phase1/titles/:id/rights', () => {
    it('should return 200 OK and structured rights avails for a valid title', async () => {
      const response = await request(app)
        .get(`/api/v1/phase1/titles/${validTitleId}/rights`)
        .set('Authorization', authToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('titleId', validTitleId);
      expect(response.body).toHaveProperty('rightsGrid');
      expect(Array.isArray(response.body.rightsGrid)).toBe(true);

      if (response.body.rightsGrid.length > 0) {
        const item = response.body.rightsGrid[0];
        expect(item).toHaveProperty('territory');
        expect(item).toHaveProperty('platform');
        expect(item).toHaveProperty('status'); // e.g., 'Available', 'Licensed', 'Blocked'
      }
    });

    it('should return 404 Not Found for an invalid or non-existent title ID', async () => {
      const response = await request(app)
        .get(`/api/v1/phase1/titles/${invalidTitleId}/rights`)
        .set('Authorization', authToken);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  /* =========================================================================
     3. GET & POST /api/v1/phase1/titles/:id/threads & /threads/:id/messages
     ========================================================================= */
  describe('Thread & Messaging Endpoints', () => {
    it('GET /titles/:id/threads - should return message threads for a given title', async () => {
      const response = await request(app)
        .get(`/api/v1/phase1/titles/${validTitleId}/threads`)
        .set('Authorization', authToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('threads');
      expect(Array.isArray(response.body.threads)).toBe(true);
    });

    it('POST /threads/:id/messages - should successfully append a new message', async () => {
      const payload = {
        message: 'Rights avail inquiry regarding OTT non-exclusive sub-license.',
        isSystemEvent: false,
      };

      const response = await request(app)
        .post(`/api/v1/phase1/threads/${validThreadId}/messages`)
        .set('Authorization', authToken)
        .send(payload);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('messageId');
      expect(response.body).toHaveProperty('threadId', validThreadId);
      expect(response.body.message).toBe(payload.message);
      expect(response.body).toHaveProperty('createdAt');
    });

    it('POST /threads/:id/messages - should return 400 Bad Request on empty message body', async () => {
      const response = await request(app)
        .post(`/api/v1/phase1/threads/${validThreadId}/messages`)
        .set('Authorization', authToken)
        .send({ message: '' }); // Invalid empty message payload

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});
