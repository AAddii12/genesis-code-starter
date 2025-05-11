
import { Textarea } from "@/components/ui/textarea";

interface CaptionEditorProps {
  caption: string;
  setCaption: (caption: string) => void;
}

export const CaptionEditor = ({ caption, setCaption }: CaptionEditorProps) => {
  return (
    <Textarea 
      placeholder="Your caption will appear here after generation" 
      value={caption} 
      onChange={e => setCaption(e.target.value)} 
      className="min-h-[200px] rounded-xl border-[#e5d8ff] focus:border-[#c9b4e8] focus:ring-1 focus:ring-[#c9b4e8] shadow-sm resize-none mb-4 text-gray-700" 
    />
  );
};
