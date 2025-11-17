import { jsPDF } from "jspdf";

export interface DemandePdfData {
    reference: string;
    typeDemande: string;
    statut: string;
    periode: {
        debut?: string | null;
        fin?: string | null;
    };
    nbJours: string;
    createdAt?: string | null;
    demandeur: {
        nom: string;
        prenom: string;
        email?: string | null;
        telephone?: string | null;
        service?: string | null;
    };
    motif?: string | null;
    chef?: {
        nom?: string | null;
        prenom?: string | null;
    } | null;
}

const PAGE_MARGIN = 20;
const LINE_HEIGHT = 8;

export function buildDemandePdf(data: DemandePdfData): Blob {
    const doc = new jsPDF();

    doc.setFont("helvetica", "normal");

    doc.setFontSize(18);
    doc.text("Fiche de demande de congé", 105, 25, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor("#555555");
    doc.text(`Référence: ${data.reference}`, PAGE_MARGIN, 40);
    doc.text(`Statut: ${data.statut}`, PAGE_MARGIN, 48);
    doc.text(`Type d'absence: ${data.typeDemande}`, PAGE_MARGIN, 56);

    let currentY = 70;
    doc.setDrawColor("#dddddd");
    doc.line(PAGE_MARGIN, currentY, 190, currentY);
    currentY += 12;

    doc.setTextColor("#222222");
    doc.setFontSize(14);
    doc.text("Informations du demandeur", PAGE_MARGIN, currentY);
    currentY += 10;

    doc.setFontSize(12);
    doc.text(`Nom: ${data.demandeur.nom} ${data.demandeur.prenom}`, PAGE_MARGIN, currentY);
    currentY += LINE_HEIGHT;
    if (data.demandeur.email) {
        doc.text(`E-mail: ${data.demandeur.email}`, PAGE_MARGIN, currentY);
        currentY += LINE_HEIGHT;
    }
    if (data.demandeur.telephone) {
        doc.text(`Téléphone: ${data.demandeur.telephone}`, PAGE_MARGIN, currentY);
        currentY += LINE_HEIGHT;
    }
    if (data.demandeur.service) {
        doc.text(`Service: ${data.demandeur.service}`, PAGE_MARGIN, currentY);
        currentY += LINE_HEIGHT;
    }

    currentY += 6;
    doc.setDrawColor("#dddddd");
    doc.line(PAGE_MARGIN, currentY, 190, currentY);
    currentY += 12;

    doc.setFontSize(14);
    doc.text("Détails du congé", PAGE_MARGIN, currentY);
    currentY += 10;

    doc.setFontSize(12);
    doc.text(
        `Période: ${data.periode.debut ?? "—"} ${data.periode.fin ? `- ${data.periode.fin}` : ""}`,
        PAGE_MARGIN,
        currentY
    );
    currentY += LINE_HEIGHT;

    doc.text(`Nombre de jours: ${data.nbJours}`, PAGE_MARGIN, currentY);
    currentY += LINE_HEIGHT;

    if (data.createdAt) {
        doc.text(`Date de création: ${data.createdAt}`, PAGE_MARGIN, currentY);
        currentY += LINE_HEIGHT;
    }

    if (data.chef?.nom || data.chef?.prenom) {
        currentY += 6;
        doc.setDrawColor("#dddddd");
        doc.line(PAGE_MARGIN, currentY, 190, currentY);
        currentY += 12;

        doc.setFontSize(14);
        doc.text("Chef de service", PAGE_MARGIN, currentY);
        currentY += 10;

        doc.setFontSize(12);
        doc.text(
            `Nom: ${[data.chef?.prenom, data.chef?.nom].filter(Boolean).join(" ") || "—"}`,
            PAGE_MARGIN,
            currentY
        );
        currentY += LINE_HEIGHT;
    }

    if (data.motif) {
        currentY += 6;
        doc.setDrawColor("#dddddd");
        doc.line(PAGE_MARGIN, currentY, 190, currentY);
        currentY += 12;

        doc.setFontSize(14);
        doc.text("Motif", PAGE_MARGIN, currentY);
        currentY += 10;

        doc.setFontSize(12);

        const splitMotif = doc.splitTextToSize(data.motif, 170);
        doc.text(splitMotif, PAGE_MARGIN, currentY);
    }

    return doc.output("blob");
}

