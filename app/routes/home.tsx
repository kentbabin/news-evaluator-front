import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "~/components/modal";
import { Loader2, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

// ------------------------------
// Home Page: Link submission form (with streaming support)
// ------------------------------
export default function HomePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string[]>([]);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    if (loading) return;
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setProgress(["Summarizing article and selecting evaluator models..."]);

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Stream failed to start");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      const handlers: Record<string, (data: any) => void> = {
        status: (d) =>
          setProgress((prev) =>
            prev[prev.length - 1] === d.message ? prev : [...prev, d.message]
          ),
        evaluation: (d) =>
          setProgress((prev) => [...prev, `✅ Model completed: ${d.model}`]),
        error: (d) =>
          setProgress((prev) => [...prev, `⚠️ ${d.message || "Error occurred"}`]),
        done: (d) => {
          setProgress((prev) => [...prev, "🎯 Evaluation completed"]);
          setTimeout(() => navigate("/results", { state: d }), 800);
        },
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let boundary = buffer.indexOf("\n\n");
        while (boundary !== -1) {
          const chunk = buffer.slice(0, boundary).trim();
          buffer = buffer.slice(boundary + 2);
          boundary = buffer.indexOf("\n\n");

          const match = chunk.match(/^event:\s*(\w+)\s*\ndata:\s*(.*)$/s);
          if (!match) continue;
          const [, event, raw] = match;

          try {
            const data = JSON.parse(raw);
            if (handlers[event]) handlers[event](data);
          } catch (err) {
            console.error("SSE parse error:", err, chunk);
          }
        }
      }
    } catch (err) {
      console.error("Streaming failed:", err);
      setProgress((p) => [...p, "❌ Failed to evaluate the article."]);
    } finally {
      setTimeout(() => setLoading(false), 1200);
    }
  };

  return (
    <div className="flex flex-col items-center px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">News Article Evaluator</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white p-6 rounded-2xl shadow"
      >
        <label className="block mb-4">
          <span className="text-gray-700">Paste a link to a non-paywalled English news article:</span>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="mt-2 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 text-gray-700"
            placeholder="https://example.com/article"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-op text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-800 disabled:opacity-60 mt-6 cursor-pointer"
        >
          {loading ? "Analyzing..." : "Evaluate"}
        </button>
      </form>

      <div className="p-8">
        <button
          onClick={() => setIsOpen(true)}
          className="text-op cursor-pointer hover:underline"
        >
          How does it work?
        </button>

        <Modal
          title="How It Works"
          text="We run each news article through the following process:<ol class='list-decimal list-inside mt-4'><li class='mb-3'>Check that the pasted link is in fact an article.</li><li class='mb-3'>Ask an LLM to produce a summary and list of topics.</li><li class='mb-3'>Have 3 other LLMs evaluate the article according to a series of criteria.</li><li class='mb-3'>Ask yet another LLM to seek consensus in the answers provided by the evaluator LLMs.</li><li class='mb-3'>Pull historical data for the same article and ask an LLM to deduplicate similar answers.</li><li>Display the results.</li></ol>"
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
    

      {loading && (
        <div className="w-full max-w-xl bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <Loader2 className="animate-spin text-op mr-2" size={20} />
            <h2 className="font-semibold text-gray-800 text-lg">
              Evaluation Progress
            </h2>
          </div>

          <div className="space-y-4 border-l-2 border-gray-200 pl-5">
            {progress.map((p, i) => {
              const lower = p.toLowerCase();
              const isComplete =
                lower.includes("completed") || lower.includes("consensus reached");
              const isPending = lower.includes("waiting");
              const isError =
                lower.includes("failed") ||
                lower.includes("error") ||
                lower.includes("⚠️");

              let icon = <Loader2 className="animate-spin text-gray-400" size={16} />;
              let iconColor = "bg-gray-100";

              if (isError) {
                icon = <AlertCircle size={16} className="text-red-600" />;
                iconColor = "bg-red-100";
              } else if (isComplete) {
                icon = <CheckCircle size={16} className="text-green-600" />;
                iconColor = "bg-green-100";
              } else if (isPending) {
                icon = <Clock size={16} className="text-yellow-500" />;
                iconColor = "bg-yellow-100";
              }

              return (
                <motion.div
                  key={i}
                  className="flex items-start space-x-3"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                >
                  {/* Icon bubble */}
                  <div
                    className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border border-gray-200 ${iconColor}`}
                  >
                    {icon}
                  </div>

                  {/* Step text */}
                  <p className="text-sm text-gray-700 leading-snug pt-1">{p}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
