import { useState } from "react";
import RichTextEditor from "./RichTextEditor";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Code2, Type } from "lucide-react";

interface Props {
  value: string;
  onChange: (html: string) => void;
}

const HtmlEditor = ({ value, onChange }: Props) => {
  const [mode, setMode] = useState<"rich" | "html">("rich");

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant={mode === "rich" ? "default" : "outline"}
          onClick={() => setMode("rich")}
        >
          <Type className="w-4 h-4 mr-1" /> Soạn thảo
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === "html" ? "default" : "outline"}
          onClick={() => setMode("html")}
        >
          <Code2 className="w-4 h-4 mr-1" /> HTML
        </Button>
      </div>

      {mode === "rich" ? (
        <RichTextEditor value={value} onChange={onChange} />
      ) : (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={24}
          className="font-mono text-xs"
          placeholder="<h1>...</h1>"
        />
      )}
    </div>
  );
};

export default HtmlEditor;
