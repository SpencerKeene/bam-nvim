import "./Researcher.css";
import React from "react";
import ResearcherPortal from "./ResearcherPortal";
import ResearcherSignin from "./ResearcherSignin";
import { useResearcherAuth } from "../../hooks/firebase";

export default function Researcher() {
  const researcher = useResearcherAuth();

  return (
    <div className="App">
      <div className="App-header">
        {researcher ? (
          <ResearcherPortal researcher={researcher} />
        ) : (
          <ResearcherSignin />
        )}
      </div>
    </div>
  );
}
