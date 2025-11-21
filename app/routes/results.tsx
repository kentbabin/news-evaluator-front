import { useState } from "react";
import { useLocation } from "react-router-dom";
import { ConsensusCard } from "../components/consensus-card"
import { ConsensusStatsCard } from "../components/history-card"
import { SquareArrowOutUpRight, CircleQuestionMark } from "lucide-react";
import { Modal } from "~/components/modal";


// ------------------------------
// Results Page
// ------------------------------
export default function ResultsPage() {
  const location = useLocation();
  const data = location.state;
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p>No evaluation data found. Return to home.</p>
      </div>
    );
  }

  const { title, url, publication, authors, published_at, summary, evaluations, consensus, history } = data;

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-900">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">Results</h1>
        
        <div className="flex flex-col mb-4">
            <div className="-m-1.5 overflow-x-auto">
                <div className="p-1.5 min-w-full inline-block align-middle">
                    <div className="border border-gray-200 rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <tbody className="">
                                <tr>
                                    <td className="px-7 pt-4 pb-2 whitespace-nowrap text-sm text-white text-end bg-op">Title</td>
                                    <td className="px-6 pt-4 pb-2 whitespace-nowrap text-sm bg-gray-50 font-semibold">{title}</td>
                                </tr>
                                <tr>
                                    <td className="px-7 py-2 whitespace-nowrap text-sm text-white text-end bg-op">Publication</td>
                                    <td className="px-6 py-2 whitespace-nowrap text-sm bg-gray-50">{publication}</td>
                                </tr>
                                <tr>
                                    <td className="px-7 py-2 whitespace-nowrap text-sm text-white text-end bg-op">Author(s)</td>
                                    <td className="px-6 py-2 whitespace-nowrap text-sm bg-gray-50">{authors.join(", ")}</td>
                                </tr>
                                <tr>
                                    <td className="px-7 py-2 whitespace-nowrap text-sm text-white text-end bg-op">Date</td>
                                    <td className="px-6 py-2 whitespace-nowrap text-sm bg-gray-50">
                                        {(() => {
                                            const timeValue = published_at;
                                            const parsed = new Date(timeValue);
                                            const isValidDate = !isNaN(parsed.getTime());

                                            return isValidDate
                                            ? parsed.toLocaleDateString()
                                            : "N/A";
                                        })()}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-7 py-2 whitespace-nowrap text-sm text-white text-end bg-op">Style</td>
                                    <td className="px-6 py-2 whitespace-nowrap text-sm bg-gray-50">{summary.type}</td>
                                </tr>
                                <tr>
                                    <td className="px-7 py-2 whitespace-nowrap text-sm text-white text-end bg-op">Topic(s)</td>
                                    <td className="px-6 py-2 whitespace-nowrap text-sm bg-gray-50">
                                        <div className="flex flex-wrap gap-2">
                                            {summary.topics.map((topic, i) => (
                                            <span
                                                key={i}
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-op border border-accent/20"
                                            >
                                                {topic}
                                            </span>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-7 pt-2 pb-4 whitespace-nowrap text-sm text-white text-end bg-op align-top">Summary</td>
                                    <td className="px-6 pt-2 pb-4 whitespace-wrap text-sm bg-gray-50">{summary.summary}<br /><br /><a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-op hover:underline">Read full article <SquareArrowOutUpRight size={14} className="inline-block" /></a></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid auto-rows-min gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 mt-10">
            <ConsensusCard
                title="Perspective"
                field="article.perspective"
                value={consensus.article.perspective}
                disagreements={consensus.disagreements}
                infoTitle="Perspective"
                infoText="The stance or slant of the article."
            />
            <ConsensusCard
                title="Tone & Language"
                field="article.tone_language"
                value={consensus.article.tone_language}
                disagreements={consensus.disagreements}
                infoTitle="Tone & Language"
                infoText="Adjectives used to describe the tone and language of the article."
            />
            <ConsensusCard
                title="Fairness"
                field="article.fairness"
                value={consensus.article.fairness}
                disagreements={consensus.disagreements}
                infoTitle="Fairness"
                infoText="How well the article articulates multiple viewpoints."
            />
            <ConsensusCard
                title="Headline vs. Article"
                field="article.headline_article"
                value={consensus.article.headline_article}
                disagreements={consensus.disagreements}
                infoTitle="Headline vs. Article"
                infoText="The gap between what the headline reads and what the article actually says. Designed to gauge the presence of clickbait."
            />
            <ConsensusCard
                title="Publication Location"
                field="publication.location"
                value={consensus.publication.location}
                disagreements={consensus.disagreements}
                infoTitle="Publication Location"
                infoText="The location of the publication's headquarters or where it's registered."
            />

            <ConsensusCard
                title="Publication Ownership"
                field="publication.ownership"
                value={consensus.publication.ownership}
                disagreements={consensus.disagreements}
                infoTitle="Publication Ownership"
                infoText="The person(s) or entity(ies) that own the publication."
            />

            <ConsensusCard
                title="Publication Funding"
                field="publication.source_of_funding"
                value={consensus.publication.source_of_funding}
                disagreements={consensus.disagreements}
                infoTitle="Publication Funding"
                infoText="Where the publication derives its funding."
            />

            <div className="relative rounded-lg overflow-hidden shadow group transition-transform duration-200 hover:scale-[1.02]">
                {/* Header */}
                <div className="bg-op text-white text-center py-2 flex justify-center items-center space-x-2">
                    <h3 className="text-md font-semibold tracking-wide">
                    Consensus Model Confidence
                    </h3>
                    <button
                        onClick={() => setIsInfoOpen(true)}
                        className="cursor-pointer hover:text-gray-200 transition"
                        >
                        <CircleQuestionMark size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="bg-gray-50 h-36 flex flex-col justify-center items-center p-4 cursor-pointer"
                     onClick={() => setIsNotesOpen(true)}>
                    <p className="text-2xl font-bold text-gray-900 text-center">
                    {consensus.confidence}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">(Click to view explanation)</p>
                </div>

                {/* Info Modal */}
                <Modal
                    title="Consensus Model Confidence"
                    text="Mean of the agreement ratios for the 7 monitored fields."
                    isOpen={isInfoOpen}
                    onClose={() => setIsInfoOpen(false)}
                />

                {/* Notes Modal */}
                <Modal
                    title="Consensus Model Explanation"
                    text={consensus.notes}
                    isOpen={isNotesOpen}
                    onClose={() => setIsNotesOpen(false)}
                />

            </div>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4">Historical Results
            <button
            onClick={() => setIsHistoryOpen(true)}
            className="cursor-pointer hover:text-gray-200 transition ms-2"
            >
            <CircleQuestionMark size={20} />
        </button>
        </h2>

        {/* History Modal */}
        <Modal
            title="Historical Results"
            text="This section shows the aggregate results of previous evaluations, not including the results above. The goal is to help you understand the general level of certainty and uncertainty across criteria. In other words, the less often consensus was reached for a particular criterion, the more uncertainty you can deduce."
            isOpen={isHistoryOpen}
            onClose={() => setIsHistoryOpen(false)}
        />
        {history?.stats && Object.keys(history.stats).length > 0 ? (
            <div className="grid auto-rows-min gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-2">
                {Object.entries(history.stats).map(([key, values]) => (
                <ConsensusStatsCard key={key} title={key} data={values} />
                ))}
            </div>
            ) : (
            <p className="text-gray-900 italic">This is the first time this article has been evaluated, so no historical results are available.</p>
        )}

        <h2 className="text-2xl font-bold mt-10 mb-4">Model Results</h2>
        <div className="">
            {evaluations.map((ev: any, idx: number) => (

                <div key={idx} className="flex flex-col mb-4">
                    <div className="-m-1.5 overflow-x-auto">
                        <div className="p-1.5 min-w-full inline-block align-middle">
                            <div className="border border-gray-200 rounded-lg shadow-xs overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <tbody className="">
                                        <tr>
                                            <td className="px-7 pt-4 pb-2 whitespace-nowrap text-sm text-white text-end bg-op">Model</td>
                                            <td className="px-6 pt-4 pb-2 whitespace-nowrap text-sm bg-gray-50 font-semibold">{ev.model}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-7 py-2 whitespace-nowrap text-sm text-white text-end bg-op">Perspective</td>
                                            <td className="px-6 py-2 whitespace-nowrap text-sm bg-gray-50">{ev.article.perspective}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-7 py-2 whitespace-nowrap text-sm text-white text-end bg-op">Tone & Language</td>
                                            <td className="px-6 py-2 whitespace-nowrap text-sm bg-gray-50">{ev.article.tone_language.join(", ")}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-7 py-2 whitespace-nowrap text-sm text-white text-end bg-op">Fairness</td>
                                            <td className="px-6 py-2 whitespace-nowrap text-sm bg-gray-50">{ev.article.fairness}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-7 py-2 whitespace-nowrap text-sm text-white text-end bg-op">Headline vs. Article</td>
                                            <td className="px-6 py-2 whitespace-nowrap text-sm bg-gray-50">{ev.article.headline_article}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-7 py-2 whitespace-nowrap text-sm text-white text-end bg-op">Publication Location</td>
                                            <td className="px-6 py-2 whitespace-nowrap text-sm bg-gray-50">{ev.publication.location}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-7 py-2 whitespace-nowrap text-sm text-white text-end bg-op align-top">Publication Ownership</td>
                                            <td className="px-6 py-2 whitespace-rap text-sm bg-gray-50">{ev.publication.ownership}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-7 py-2 whitespace-nowrap text-sm text-white text-end bg-op align-top">Publication Funding</td>
                                            <td className="px-6 py-2 whitespace-wrap text-sm bg-gray-50">{ev.publication.source_of_funding.join(", ")}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-7 pt-2 pb-4 whitespace-nowrap text-sm text-white text-end bg-op align-top">Notes</td>
                                            <td className="px-6 pt-2 pb-4 whitespace-wrap text-sm bg-gray-50">{ev.article.notes}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* <div className="mt-6 mb-10">

            {Array.isArray(consensus?.disagreements) && consensus.disagreements.length > 0 ? (
                <div className="space-y-8">
                {consensus.disagreements.map((d: any) => (
                    <div key={d.field} className="space-y-3">
                    <h4 className="text-md font-semibold text-gray-800 border-b border-gray-200 pb-1">
                        {d.field.replace("_", " ")}
                    </h4>

                    <div className="flex flex-col gap-3">
                        {(d.evaluations || []).map((e: any, i: number) => {
                        let rawValue = e.value ?? "-";

                        // 🧠 Try to parse if it's a stringified array
                        if (typeof rawValue === "string" && rawValue.startsWith("[")) {
                            try {
                            const parsed = JSON.parse(rawValue);
                            if (Array.isArray(parsed)) {
                                rawValue = parsed.join(", ");
                            }
                            } catch {
                            // Leave as-is if not valid JSON
                            }
                        } else if (Array.isArray(rawValue)) {
                            rawValue = rawValue.join(", ");
                        }

                        return (
                            <div
                            key={e.model}
                            className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm border text-sm leading-snug ${
                                i % 2 === 0
                                ? "bg-blue-50 border-blue-100 text-blue-800 self-start"
                                : "bg-gray-100 border-gray-200 text-gray-800 self-end ml-auto"
                            }`}
                            >
                            <span className="block text-xs font-semibold opacity-70 mb-1">
                                {e.model}
                            </span>
                            <span>{rawValue}</span>
                            </div>
                        );
                        })}
                    </div>
                    </div>
                ))}
                </div>
            ) : (
                <p className="text-gray-600 italic">No disagreements found.</p>
            )}
        </div> */}
      </div>
    </div>
  );
}