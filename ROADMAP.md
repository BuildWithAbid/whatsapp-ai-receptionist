# Roadmap

This roadmap is intentionally practical. The goal is not to turn the project into a feature dump, but to make it more useful, safer, and easier to deploy for real small-business workflows.

## Current State

The repository already includes:

- multi-tenant workspace model
- owner authentication
- WhatsApp webhook ingestion
- AI-assisted FAQ, lead, and booking flow
- business settings and FAQ management
- dashboard for conversations, leads, and booking requests
- Docker and CI baseline

## Near-Term Priorities

### 1. Tenant Safety and Testing

- Add stronger integration tests around cross-tenant access denial
- Add webhook idempotency tests for duplicate delivery retries
- Add service-level tests for lead and booking upsert behavior

### 2. Operational Hardening

- Replace in-memory rate limiting with Redis or another shared backend
- Add request correlation IDs and richer structured logs
- Add health and readiness endpoints for production deploys

### 3. Better WhatsApp Ergonomics

- Support message status updates more completely
- Add media-message handling strategy and fallback behavior
- Improve business onboarding copy for Meta identifiers and webhook setup

## Mid-Term Improvements

### 4. Team Support

- Add team-member accounts within a workspace
- Add roles such as owner, manager, and support agent
- Add audit coverage for more admin actions

### 5. Smarter Booking Workflows

- Add booking slot preferences as structured fields
- Add optional calendar integration adapters
- Add workflow states for confirmed, rescheduled, and cancelled requests

### 6. Better AI Guardrails

- Add stricter structured-output enforcement
- Add configurable safe-reply policies by workspace
- Add prompt evaluation fixtures for common business categories

## Longer-Term Opportunities

### 7. Background Processing

- Move webhook post-processing to a queue for higher throughput
- Add retry policies for outbound messaging and AI calls
- Add dead-letter handling for persistent failures

### 8. Analytics and Reporting

- Trend charts for conversations, leads, and bookings
- Response confidence and escalation reporting
- Conversion metrics by service type

### 9. White-Label / Agency Workflows

- Multi-workspace management for agencies
- Provisioning templates for business categories
- Shared FAQ starters and onboarding packs

## Good First Contribution Areas

- Documentation improvements
- Better empty states and onboarding hints
- Additional tests around validation and webhook parsing
- Safer error handling around external APIs
- Deployment guides for specific hosting providers
