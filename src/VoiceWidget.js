import React, { useEffect, useState, useRef } from "react";
import { usePorcupine } from "@picovoice/porcupine-react";
import IntentWidget from "./IntentWidget";

export default function VoiceWidget() {
  const [keywordDetections, setKeywordDetections] = useState("");
  const [activated, setActivated] = useState(false);
  const [command, setCommand] = useState("");
  const initialized = useRef(false)

  const {
    keywordDetection,
    isLoaded,
    isListening,
    error,
    init,
    start,
    stop,
    release,
  } = usePorcupine();

  const porcupineModel = {
    publicPath: "/models/porcupine_params.pv",
    customWritePath: "2.2.0_porcupine_params.pv"
  }

  const keywordsModel = {
    publicPath: "/keywords/Hey-Max_en_wasm_v2_2_0.ppn",
    label: "Hey Max"
  }
  const startPoripine = async () => {

    await init(
      "rfAgO8g38Gq/2xPycyvWZWrKJSrV8ES04/yxwl0iyTSXauh0/AtBeg==",
      [keywordsModel],
      porcupineModel
    );
    await start()
    console.log("Porcupine logged")
  }

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      startPoripine()
    }

  }, [])
  useEffect(() => {

    if (keywordDetection !== null) {
      setKeywordDetections("Hi! How may I help you?")
      setActivated(true)
      setCommand("")
    }
  }, [keywordDetection]);

  return (
    <div>
      <li >{keywordDetections}</li>
      {activated && <IntentWidget onEnd={() => { setActivated(false); setKeywordDetections("") }} onGet={(intent) => { setCommand(intent) }} />}
      <p>{command}</p>
    </div>
  );
}

