import { legalDocuments, type LegalSlug, type LegalPageProps } from './LegalLayout';
import { PrivacyPolicy } from './PrivacyPolicy';
import { TermsOfService } from './TermsOfService';
import { CommunityGuidelines } from './CommuintyGuidelines';
import { CookiePolicy } from './CookiePolicy';
export { legalDocuments };
export type { LegalSlug };
export function LegalPage({slug, ...props}: LegalPageProps & {slug: LegalSlug}) {
  switch (slug) {
    case 'privacy': return <PrivacyPolicy {...props} />;
    case 'termini': return <TermsOfService {...props} />;
    case 'community-rules': return <CommunityGuidelines {...props} />;
    case 'cookie-policy': return <CookiePolicy {...props} />;
  }
}