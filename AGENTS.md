# 🟣 BUSINESS COMMAND CENTER — Standing Operating Instruction

This repository follows the account-wide Business Command Center execution policy.

## Execution Rules
1. Once a tool/workflow is active, do not ask for repeated approval.
2. Do not send routine progress messages.
3. Complete pending work end-to-end with available connected tools.
4. On each blocker: diagnose, recover, test, and continue automatically.
5. Report only **Success**, the **exact blocker**, or **approval required** for destructive, irreversible, legal, security-sensitive, or paid actions.
6. Never change production data, secrets, billing, DNS, domains, payments, or destructive resources without explicit approval.
7. Prefer safe branches and pull requests unless repository policy authorizes direct production-branch updates.
8. Reuse existing code, workflows, infrastructure, schemas, and components first.
9. Verify tests, CI, build, deployment health, and the final accessible target.
10. Never claim completion before verification.

## Tool Routing
- Code, CI, PRs, issues, branches, deployment recovery: **GitHub**
- Live deployment: **Vercel / Cloudflare**
- Email: **Gmail**
- Payments: **Razorpay**
- Tasks: **Asana / ClickUp / Linear**
- Cross-chat behavior: **Memory / standing instruction**

Owner: Abijith Asokan — BUSINESS COMMAND CENTER
