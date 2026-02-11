import { useState, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";

interface ConsensusData {
  article: {};
  publication_funding: string;
  publication_location: string;
  publication_ownership: string;
  confidence: number;
  disagreements: any[];
  notes: string;
}

interface SummaryData {
  summary: string;
  topics: string[];
  type: string;
}

interface Result {
  url: string;
  publication: string;
  summary: SummaryData;
  consensus: ConsensusData;
}

interface ArticleGroup {
  article: string;
  results: Result[];
}

// ------------------------------
// Report Page: Displays grouped articles in a table
// ------------------------------
export default function ReportPage() {
  const [data, setData] = useState<ArticleGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://operationpluto.pythonanywhere.com/results");
        // const response = await fetch("http://127.0.0.1:8000/results");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(Array.isArray(result) ? result : [result]);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Loading report data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <AlertCircle className="w-8 h-8 text-red-600 mb-4" />
        <p className="text-red-600 font-semibold">Error: {error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  const getFairnessColor = (fairness: string) => {
    switch (fairness.toLowerCase()) {
      case "high":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.75) return "bg-green-100 text-green-800";
    if (confidence >= 0.5) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getPerspectiveColor = (perspective: string | string[]) => {
    if (!perspective || (Array.isArray(perspective) && perspective.length === 0) || (typeof perspective === "string" && perspective.toLowerCase() === "no consensus")) {
      return "bg-gray-100 text-gray-800";
    }
    return "bg-blue-100 text-blue-800";
  };

  const getToneLanguageColor = (tone: string | string[]) => {
    if (!tone || (Array.isArray(tone) && tone.length === 0) || (typeof tone === "string" && tone.toLowerCase() === "no consensus")) {
      return "bg-gray-100 text-gray-800";
    }
    return "bg-blue-100 text-blue-800";
  };

  const getHeadlineColor = (headline: string) => {
    if (!headline || (Array.isArray(headline) && headline.length === 0)) return "bg-gray-100 text-gray-800";
    const lower = typeof headline === "string" ? headline.toLowerCase() : "";
    switch (lower) {
      case "small":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "large":
        return "bg-red-100 text-red-800";
      case "no consensus":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-900">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">Report</h1>

        <div className="space-y-6">
          {data.map((articleGroup, groupIndex) => (
            <div key={groupIndex} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Article Title Header */}
              <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-md font-semibold text-gray-900">
                  {articleGroup.article}
                </h2>
              </div>

              {/* Results Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Publication
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Perspective
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Tone & Language
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Clickbait Rating
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Fairness
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Disagreements
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Confidence
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {articleGroup.results.map((result, resultIndex) => (
                      <tr
                        key={resultIndex}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {new URL(result.publication).hostname}
                          </a>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(result.consensus?.article_perspective) ? (
                              result.consensus.article.perspective.map((item: string, i: number) => (
                                <span
                                  key={i}
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${getPerspectiveColor(
                                    item
                                  )}`}
                                >
                                  {item}
                                </span>
                              ))
                            ) : (
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getPerspectiveColor(
                                  result.consensus?.article.perspective || "N/A"
                                )}`}
                              >
                                {result.consensus?.article.perspective || "N/A"}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(result.consensus?.article.tone_language) ? (
                              result.consensus.article.tone_language.map((item: string, i: number) => (
                                <span
                                  key={i}
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${getToneLanguageColor(
                                    item
                                  )}`}
                                >
                                  {item}
                                </span>
                              ))
                            ) : (
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getToneLanguageColor(
                                  result.consensus?.article.tone_language || "N/A"
                                )}`}
                              >
                                {result.consensus?.article.tone_language || "N/A"}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getHeadlineColor(
                              result.consensus?.article.headline_article || "N/A"
                            )}`}
                          >
                            {result.consensus?.article.headline_article || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getFairnessColor(
                              result.consensus?.article.fairness || "N/A"
                            )}`}
                          >
                            {result.consensus?.article.fairness || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                            {result.consensus?.disagreements?.length || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getConfidenceColor(
                              result.consensus?.confidence || 0
                            )}`}
                          >
                            {(result.consensus?.confidence * 100).toFixed(0)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-sm text-gray-600">
          Total article groups: <span className="font-semibold">{data.length}</span>
        </div>
      </div>
    </div>
  );
}
