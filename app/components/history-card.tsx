import React, { useState } from "react";
import { Modal } from "~/components/modal";
import { CircleQuestionMark } from "lucide-react";

interface Answer {
  answer: string;
  count: number;
}

interface ConsensusStatsCardProps {
  title: string;
  data: {
    consensus: number;
    no_consensus: number;
    answers?: Answer[];
  };
}

const FIELD_NAME_MAP: Record<string, string> = {
  perspective: "Perspective",
  tone_language: "Tone & Language",
  fairness: "Fairness",
  headline_article: "Headline vs. Article",
  source_of_funding: "Publication Funding",
  location: "Publication Location",
  ownership: "Publication Ownership",
};

export const ConsensusStatsCard: React.FC<ConsensusStatsCardProps> = ({
  title,
  data,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Get top 4 answers by count
  const topAnswers =
    data.answers
      ?.sort((a, b) => b.count - a.count)
      .slice(0, 4) || [];

  return (
    <>
      <div className="relative rounded-lg overflow-hidden shadow bg-white transition-transform duration-200 hover:scale-[1.02] cursor-pointer">
        {/* Header */}
        <div className="bg-op text-white text-center py-2 flex items-center justify-center gap-2">
          <h3 className="text-md font-semibold tracking-wide">
            {FIELD_NAME_MAP[title] || title}
          </h3>
        </div>

        {/* Body */}
        <div onClick={() => setIsOpen(true)}>
          <div className="bg-gray-50 h-30 flex flex-row justify-around items-center h-24 text-center cursor-pointer">
            <div>
              <p className="text-2xl font-bold text-accent">{data.consensus}%</p>
              <p className="text-sm font-semibold text-gray-700 mt-2">Consensus</p>
            </div>
            <div className="w-px h-12 bg-gray-300" />
            <div>
              <p className="text-2xl font-bold text-red-900">{data.no_consensus}%</p>
              <p className="text-sm font-semibold text-gray-700 mt-2">
                No Consensus
              </p>
            </div>
          </div>
          <div className="bg-gray-50 pb-3 text-center cursor-pointer">
            <p className="text-sm text-gray-500">(Click to view most frequent answers)</p>
          </div>
        </div>
      </div>

      {/* Modal for answer breakdown */}
      {topAnswers.length > 0 && (
        <Modal
          title={`Most Frequent Answers for ${FIELD_NAME_MAP[title] || title}`}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          text={`
            <table class='w-full text-sm text-left border-collapse mt-4'>
              <thead>
                <tr>
                  <th class='border-b border-gray-300 py-2 px-2 font-semibold align-top'>Answer</th>
                  <th class='border-b border-gray-300 py-2 px-2 text-right font-semibold align-top'>Count</th>
                </tr>
              </thead>
              <tbody>
                ${topAnswers
                  .map(
                    (a) => `
                    <tr>
                      <td class='py-2 px-2'>${a.answer}</td>
                      <td class='py-2 px-2 text-right align-top'>${a.count}</td>
                    </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          `}
        />
      )}
    </>
  );
};
