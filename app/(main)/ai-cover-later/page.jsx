import { getCoverLetter } from "@/actions/coverLetter";
import CoverLetterView from "./_components/CoverLetterView";

export default async function CoverLetterPage() {
  const coverLetter = await getCoverLetter();
  return <CoverLetterView existingLetter={coverLetter} />;
}