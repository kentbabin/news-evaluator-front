// src/pages/about.tsx
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const markdown = `
# About the News Evaluator Tool

This tool is built on the premise that in this era of information overload, it's simply unrealistic to evaluate every news article a person comes across in a given day. People end up reading headlines only and deciding to share articles based on their emotional reaction to the headline. With the help of AI, we're making the evaluation process a lot easier. 

However, we deliberately avoid attempting to fact check or determine the truth of an article because then we would be subject to the same biases as every other fact checker. Instead, we aim to provide the user with the additional context for the article and the entity that published it.

Specifically, we look at 6 criteria:

- **Article perspective**: the general stance or slant of the article
- **Article tone**: adjectives used to describe the tone and language of the article
- **Article fairness**: how well the article articulates multiple viewpoints.
- **Headline vs article**: The gap between what the headline reads and what the article actually says.
- **Publication source of funding**: Where the publication derives its funding
- **Publication ownership**: The person(s) or entity(ies) that own the publication.
- **Publication location**: The location of the publication's headquarters or where it's registered.

The hope is that users will get a sense of the motivation behind the article and publication. Is there deliberate clickbait? Was there any attempt at providing an alternative perspective? Does the publication's ownership or source of funding indicate a clear bias?

Answers to questions like these are important because we know that even articles intended to deceive are often grounded in a kernel of truth.

## Data

We've also added a data component to see how models and publications compare at an aggregate level over time. This will help us understand tendencies and predilections to things like clickbait and one-sidedness. 


`;

export default function AboutPage() {
  return (
    <div className="prose mx-auto p-6">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
}
