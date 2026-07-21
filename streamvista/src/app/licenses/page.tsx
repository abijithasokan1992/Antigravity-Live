import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { z } from 'zod';
import { motion } from 'framer-motion';

// Types
type Organization = {
  id: string;
  legalName: string;
  displayName: string;
};

type License = {
  id: string;
  organization: Organization;
  issuedAt?: string;
  expiresAt?: string;
  notes?: string;
  isSublicensable: boolean;
};

// Zod schema for client‑side validation
const LicenseFormSchema = z.object({
  organizationId: z.string().uuid(),
  issuedAt: z.string().optional(), // ISO date
  expiresAt: z.string().optional(),
  notes: z.string().optional(),
});

type FormState = z.infer<typeof LicenseFormSchema>;

export default function LicensesPage() {
  const queryClient = useQueryClient();
  const { data: licenses, isLoading } = useQuery<License[]>(['licenses'], async () => {
    const res = await fetch('/api/licenses');
    if (!res.ok) throw new Error('Failed to load licenses');
    return res.json();
  });

  const createMutation = useMutation(
    async (newLicense: FormState) => {
      const res = await fetch('/api/licenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLicense),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create');
      }
      return res.json();
    },
    {
      // Optimistic UI – show the new license immediately
      onMutate: async (newLicense) => {
        await queryClient.cancelQueries(['licenses']);
        const previous = queryClient.getQueryData<License[]>(['licenses']);
        const optimisticLicense: License = {
          id: 'temp-' + Math.random().toString(36).substr(2, 9),
          organization: { id: newLicense.organizationId, legalName: '', displayName: '' },
          issuedAt: newLicense.issuedAt,
          expiresAt: newLicense.expiresAt,
          notes: newLicense.notes,
          isSublicensable: false,
        };
        queryClient.setQueryData(['licenses'], [...(previous ?? []), optimisticLicense]);
        return { previous };
      },
      onError: (err, _new, context) => {
        if (context?.previous) queryClient.setQueryData(['licenses'], context.previous);
        console.error(err);
      },
      onSettled: () => queryClient.invalidateQueries(['licenses']),
    }
  );

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>({ organizationId: '' });
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parse = LicenseFormSchema.safeParse(form);
    if (!parse.success) {
      setFormError('Invalid input – please check all fields');
      return;
    }
    setFormError(null);
    try {
      await createMutation.mutateAsync(parse.data);
      setShowModal(false);
      setForm({ organizationId: '' });
    } catch (e) {
      setFormError((e as Error).message);
    }
  };

  return (
    <section className="p-8 bg-gray-900 text-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Licenses</h1>

      {/* License List */}
      {isLoading ? (
        <p>Loading licenses…</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {licenses?.map((lic) => (
            <motion.li
              key={lic.id}
              className="bg-gray-800 rounded-lg p-4 shadow-lg"
              whileHover={{ scale: 1.02 }}
            >
              <h2 className="text-xl font-semibold">{lic.organization.displayName || lic.organization.legalName}</h2>
              <p className="text-sm mt-2">Issued: {lic.issuedAt ? new Date(lic.issuedAt).toLocaleDateString() : '—'}</p>
              <p className="text-sm">Expires: {lic.expiresAt ? new Date(lic.expiresAt).toLocaleDateString() : '—'}</p>
              <p className="text-sm mt-2">Notes: {lic.notes ?? '—'}</p>
              <p className="text-xs text-gray-400 mt-2">Non‑sublicensable</p>
            </motion.li>
          ))}
        </ul>
      )}

      {/* Add License Button */}
      <button
        onClick={() => setShowModal(true)}
        className="mt-8 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-md text-white transition"
      >
        Add New License
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
          <motion.div
            className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl mb-4">Create License</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Organization ID</label>
                <input
                  type="text"
                  value={form.organizationId}
                  onChange={(e) => setForm({ ...form, organizationId: e.target.value })}
                  className="w-full p-2 bg-gray-700 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Issued At (ISO)</label>
                <input
                  type="date"
                  value={form.issuedAt ?? ''}
                  onChange={(e) => setForm({ ...form, issuedAt: e.target.value })}
                  className="w-full p-2 bg-gray-700 rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Expires At (ISO)</label>
                <input
                  type="date"
                  value={form.expiresAt ?? ''}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                  className="w-full p-2 bg-gray-700 rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Notes</label>
                <textarea
                  value={form.notes ?? ''}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full p-2 bg-gray-700 rounded"
                />
              </div>
              {formError && <p className="text-red-400 text-sm">{formError}</p>}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded"
                >
                  Create
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </section>
  );
}
