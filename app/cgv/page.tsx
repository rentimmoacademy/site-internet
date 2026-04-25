import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = { title: "Conditions générales de vente" };

export default function CGVPage() {
  return (
    <LegalLayout title="Conditions générales de vente" updated="1er avril 2026">
      <h2>Article 1 — Objet</h2>
      <p>
        Les présentes conditions générales de vente (CGV) régissent les relations contractuelles entre
        Rentimmo Academy (ci-après « l'Organisme ») et toute personne (ci-après « l'Apprenant ») qui
        souscrit à l'une de ses formations.
      </p>

      <h2>Article 2 — Formations proposées</h2>
      <p>
        L'Organisme propose trois formations : Sous-Location Academy, Conciergerie BnB Academy et
        Cleaning BnB Academy. Chaque formation fait l'objet d'une description détaillée sur le site.
        L'Apprenant reconnaît avoir pris connaissance du programme et des conditions d'accès avant toute
        souscription.
      </p>

      <h2>Article 3 — Tarifs et modalités de paiement</h2>
      <p>
        Les prix sont indiqués en euros TTC. Le paiement peut être effectué :
      </p>
      <ul>
        <li>en une seule fois par carte bancaire,</li>
        <li>en 3 mensualités sans frais,</li>
        <li>via le CPF lorsque la formation est référencée EDOF.</li>
      </ul>
      <p>
        L'accès à la formation est déclenché dès réception du paiement (ou du premier prélèvement en cas
        d'échelonnement).
      </p>

      <h2>Article 4 — Accès à la formation</h2>
      <p>
        L'Apprenant bénéficie d'un accès à vie au contenu de la formation souscrite, incluant les mises à
        jour. L'accès est personnel, non cessible et non transmissible. Toute tentative de partage
        entraîne la résiliation immédiate sans remboursement.
      </p>

      <h2>Article 5 — Droit de rétractation</h2>
      <p>
        Conformément à l'article L221-18 du Code de la consommation, l'Apprenant dispose d'un délai de{" "}
        <strong>14 jours calendaires</strong> à compter de la date de souscription pour se rétracter, sans
        motif à fournir. La demande de rétractation doit être adressée par email à{" "}
        <a href="mailto:rentimmoacademy@gmail.com">rentimmoacademy@gmail.com</a>.
      </p>
      <p>
        En cas de rétractation valide, le remboursement intégral est effectué sous 14 jours par le même
        moyen de paiement.
      </p>

      <h2>Article 6 — Politique de remboursement</h2>
      <p>
        Au-delà des 14 jours légaux de rétractation, aucun remboursement ne pourra être accordé, sauf cas
        exceptionnel apprécié par l'Organisme (problème technique majeur, cas de force majeure).
      </p>

      <h2>Article 7 — Obligations de l'Organisme</h2>
      <p>
        L'Organisme s'engage à délivrer un contenu conforme à la description commerciale, accessible 24h/24
        et 7j/7. En cas d'interruption technique, l'accès est prolongé gratuitement pour une durée
        équivalente.
      </p>

      <h2>Article 8 — Propriété intellectuelle</h2>
      <p>
        Tous les supports (vidéos, PDF, templates, bails types, scripts) sont la propriété exclusive de
        Rentimmo Academy. Toute reproduction, diffusion ou revente est strictement interdite et peut
        faire l'objet de poursuites.
      </p>

      <h2>Article 9 — Protection des données</h2>
      <p>
        L'Apprenant est informé que ses données personnelles sont collectées et traitées conformément à
        notre <a href="/politique-confidentialite">politique de confidentialité</a>.
      </p>

      <h2>Article 10 — Litiges</h2>
      <p>
        En cas de litige, une solution amiable est recherchée en priorité. À défaut, le tribunal
        compétent sera celui du siège social de l'Organisme. Le droit applicable est le droit français.
      </p>
    </LegalLayout>
  );
}
