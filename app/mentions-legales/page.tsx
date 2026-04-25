import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = { title: "Mentions légales" };

export default function MentionsLegalesPage() {
  return (
    <LegalLayout title="Mentions légales" updated="1er avril 2026">
      <h2>Éditeur du site</h2>
      <p>
        <strong>Rentimmo Academy</strong>
        <br />
        Forme juridique : SASU
        <br />
        Capital social : 1 000 €
        <br />
        Siège social : [Adresse à compléter], France
        <br />
        SIREN : [à compléter]
        <br />
        Numéro de TVA intracommunautaire : [à compléter]
        <br />
        Directeur de la publication : Marwan Afassi
        <br />
        Email : rentimmoacademy@gmail.com
      </p>

      <h2>Hébergeur</h2>
      <p>
        Vercel Inc.
        <br />
        340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis
        <br />
        <a href="https://vercel.com">vercel.com</a>
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L'ensemble des éléments présents sur le site (textes, images, logos, vidéos, programmes de
        formation, supports pédagogiques) sont la propriété exclusive de Rentimmo Academy ou de ses
        partenaires. Toute reproduction, représentation, modification, publication, adaptation totale ou
        partielle des éléments du site est interdite sans autorisation écrite préalable.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Les informations recueillies sur ce site sont traitées conformément au Règlement Général sur la
        Protection des Données (RGPD) et à la loi Informatique et Libertés. Pour plus d'information,
        consultez notre <a href="/politique-confidentialite">politique de confidentialité</a>.
      </p>

      <h2>Organisme de formation</h2>
      <p>
        Rentimmo Academy est en cours de référencement Qualiopi pour la formation professionnelle
        continue. Le numéro de déclaration d'activité sera publié ici dès obtention. Certaines formations
        pourront être finançables via le CPF (EDOF), OPCO ou Pôle Emploi après validation Qualiopi.
      </p>

      <h2>Crédits</h2>
      <p>
        Design & développement : Rentimmo Academy
        <br />
        Typographie : Plus Jakarta Sans (SIL Open Font License)
      </p>
    </LegalLayout>
  );
}
