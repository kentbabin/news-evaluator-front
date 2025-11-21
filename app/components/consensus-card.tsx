import { Modal } from "~/components/modal";
import { CircleQuestionMark } from "lucide-react";
import { useState } from "react";

interface ConsensusCardProps {
  title: string;
  field: string;
  value: any;
  disagreements?: any[];
  infoTitle?: string;
  infoText?: string;
}

export const ConsensusCard: React.FC<ConsensusCardProps> = ({
  title,
  field,
  value,
  disagreements,
  infoTitle,
  infoText,
}) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isDisagreeOpen, setIsDisagreeOpen] = useState(false);

  let isNoConsensus = false;
  let displayValue = "";

  // Handle value display logic
  if (typeof value === "string") {
    displayValue = value;
    isNoConsensus = value.toLowerCase() === "no consensus";
  } else if (Array.isArray(value)) {
    if (value.length === 0) {
      displayValue = "No Consensus";
      isNoConsensus = true;
    } else {
      displayValue = value.join(", ");
    }
  } else if (typeof value === "number") {
    displayValue = value.toString();
  } else if (typeof value === "object" && value !== null) {
    const { consensus, no_consensus } = value;
    if (typeof consensus === "number" && typeof no_consensus === "number") {
      displayValue = `${consensus}% Consensus / ${no_consensus}% No Consensus`;
    } else {
      displayValue = JSON.stringify(value);
    }
  } else {
    displayValue = "No Consensus";
    isNoConsensus = true;
  }

  // Find disagreement entry for this field
  const disagreement = disagreements?.find((d) => d.field === field);

  return (
    <div
      className={`relative rounded-lg overflow-hidden shadow transition-transform duration-200 ${
        isNoConsensus ? "hover:scale-[1.02] cursor-pointer" : ""
      }`}
    >
      {/* Header */}
      <div className="bg-op text-white text-center py-2 flex justify-center items-center space-x-2">
        <h3 className="text-md font-semibold tracking-wide">{title}</h3>
        <button
          onClick={() => setIsInfoOpen(true)}
          className="cursor-pointer hover:text-gray-200 transition"
        >
          <CircleQuestionMark size={18} />
        </button>
      </div>

      {/* Body */}
      <div
        className={`bg-gray-50 h-36 flex flex-col justify-center items-center p-4 ${
          isNoConsensus ? "cursor-pointer" : ""
        }`}
        onClick={() => isNoConsensus && disagreement && setIsDisagreeOpen(true)}
      >
        <p
          className={`text-xl font-bold text-center ${
            isNoConsensus ? "text-red-900" : "text-gray-800"
          }`}
        >
          {displayValue}
        </p>
        {isNoConsensus && disagreement && (
          <p className="text-sm text-gray-500 mt-2">(Click to view model results)</p>
        )}
      </div>

      {/* Info Modal */}
      <Modal
        title={infoTitle}
        text={infoText}
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />

      {/* Disagreement Modal */}
      {disagreement && (
        <Modal
          title={`Results: ${title}`}
          text={`
            <table class='w-full text-sm text-left border-collapse mt-4'>
              <thead>
                <tr>
                  <th class='border-b border-gray-300 py-2 px-2 font-semibold align-top'>Model</th>
                  <th class='border-b border-gray-300 py-2 px-2 font-semibold align-top'>Answer</th>
                </tr>
              </thead>
              <tbody>
                ${disagreement.evaluations
                  .map(
                    (e) => {
                      let val = e.value;
                      if (Array.isArray(val)) val = val.join(", ");
                      else if (typeof val === "string" && val.trim().startsWith("[")) {
                        try {
                          const parsed = JSON.parse(val);
                          if (Array.isArray(parsed)) val = parsed.join(", ");
                        } catch {}
                      }
                      return (
                        `<tr>
                          <td class='py-2 px-2 align-top font-semibold'>${e.model}</td>
                          <td class='py-2 px-2 align-top'>${val}</td>
                        </tr>`
                  )}
                  )
                  .join("")}
              </tbody>
            </table>
          `}
          isOpen={isDisagreeOpen}
          onClose={() => setIsDisagreeOpen(false)}
        />
      )}
    </div>
  );
};
