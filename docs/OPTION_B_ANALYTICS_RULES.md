# Firestore rules addition — Option B (do not publish until reviewed)
# Insert INSIDE match /databases/{database}/documents { ... }
# The existing isDistributionAdmin() helper is reused.

match /distributionClicks/{clickId} {
  allow create: if request.resource.data.keys().hasOnly([
      'leadId', 'kind', 'version', 'source', 'createdAt'
    ])
    && request.resource.data.keys().hasAll([
      'leadId', 'kind', 'version', 'source', 'createdAt'
    ])
    && request.resource.data.leadId is string
    && request.resource.data.leadId.size() == 20
    && request.resource.data.kind in ['android', 'wall']
    && request.resource.data.version is string
    && request.resource.data.version.size() <= 40
    && request.resource.data.source == 'website'
    && request.resource.data.createdAt == request.time
    && exists(/databases/$(database)/documents/distributionLeads/$(request.resource.data.leadId));
  allow get, list: if isDistributionAdmin();
  allow update, delete: if false;
}

# IMPORTANT:
# This validation does NOT reliably stop scripts/bots from making many writes.
# Public anonymous Firestore writes can consume Spark quota and impact the family app.
# Production launch should wait for abuse controls and a read-only test of the full rules.
# Do not put email addresses in analytics events; associate using random leadId only.
