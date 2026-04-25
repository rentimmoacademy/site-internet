import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = { title: "Politique de confidentialité" };

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalLayout title="Politique de confidentialité" updated="1er avril 2026">
      <p>
        Rentimmo Academy attache une importance capitale à la protection de vos données personnelles. La
        présente politique explique quelles données nous collectons, pourquoi, combien de temps elles
        sont conservées et comment vous pouvez exercer vos droits.
      </p>

      <h2>1. Responsable du traitement</h2>
      <p>
        Le responsable du traitement est <strong>Rentimmo Academy</strong>, [adresse à compléter], joignable
        à <a href="mailto:rentimmoacademy@gmail.com">rentimmoacademy@gmail.com</a>.
      </p>

      <h2>2. Données collectées</h2>
      <p>Nous collectons les catégories suivantes :</p>
      <ul>
        <li>
          <strong>Identité</strong> : nom, prénom, email, téléphone (si fourni).
        </li>
        <li>
          <strong>Facturation</strong> : adresse, informations de paiement (traitées par notre
          prestataire Stripe, jamais stockées chez nous).
        </li>
        <li>
          <strong>Comportement</strong> : pages visitées, temps passé, interactions (via cookies analytics
          si consentement).
        </li>
      </ul>

      <h2>3. Finalités</h2>
      <ul>
        <li>Délivrer les formations souscrites et gérer le compte apprenant.</li>
        <li>Répondre aux demandes via le formulaire de contact.</li>
        <li>Envoyer des communications marketing (uniquement avec consentement).</li>
        <li>Mesurer l'audience et améliorer l'expérience.</li>
        <li>Respecter les obligations légales et comptables.</li>
      </ul>

      <h2>4. Base légale</h2>
      <p>
        Le traitement repose selon les cas sur l'exécution du contrat, votre consentement, notre intérêt
        légitime ou une obligation légale.
      </p>

      <h2>5. Durée de conservation</h2>
      <ul>
        <li>Données client : 3 ans après la fin de la relation commerciale.</li>
        <li>Données comptables : 10 ans (obligation légale).</li>
        <li>Cookies : 13 mois maximum.</li>
      </ul>

      <h2>6. Vos droits</h2>
      <p>
        Conformément au RGPD, vous disposez des droits d'accès, de rectification, d'effacement, de
        limitation, de portabilité et d'opposition. Vous pouvez les exercer à tout moment en écrivant à{" "}
        <a href="mailto:rentimmoacademy@gmail.com">rentimmoacademy@gmail.com</a>.
      </p>
      <p>
        Vous pouvez également introduire une réclamation auprès de la CNIL (
        <a href="https://www.cnil.fr">cnil.fr</a>).
      </p>

      <h2>7. Cookies</h2>
      <p>
        Nous utilisons deux types de cookies :
      </p>
      <ul>
        <li>
          <strong>Cookies techniques</strong> (nécessaires, pas de consentement requis) : session, panier,
          authentification.
        </li>
        <li>
          <strong>Cookies analytics et marketing</strong> (Google Analytics, Meta Pixel) : déposés
          uniquement après votre consentement explicite via le bandeau.
        </li>
      </ul>
      <p>
        Vous pouvez modifier votre choix à tout moment en cliquant sur « Gérer mes cookies » dans le
        pied de page.
      </p>

      <h2>8. Destinataires</h2>
      <p>
        Vos données sont accessibles uniquement à l'équipe Rentimmo Academy et à nos sous-traitants
        (Stripe pour le paiement, Vercel pour l'hébergement, SendGrid pour l'emailing). Toutes les
        données restent au sein de l'UE ou sont transférées sous les clauses contractuelles types de la
        Commission européenne.
      </p>
    </LegalLayout>
  );
}
