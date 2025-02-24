// src/app/page.tsx

import VideoScriptGenerator from "../script-generator";  
// import ScriptGenerator from "../script-generator";
import Footer from "../footer";  
// import ScriptGenerator from "../script-test";  

export default function Home() {
  return (
    <>
      <VideoScriptGenerator />
      <Footer />
      {/* <ScriptGenerator /> */}
    </>
  );
}