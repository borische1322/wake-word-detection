import React, { useEffect, useState, useRef } from "react";
import { useRhino } from "@picovoice/rhino-react";

export default function IntentWidget( {onEnd= () => {}, onGet=(intent)=>{} }) {
  const [intentDetections, setIntentDetections] = useState([]);
  const initialized = useRef(false)
  const {
    inference,
    contextInfo,
    isLoaded,
    isListening,
    error,
    init,
    process,
    release,
  } = useRhino();

  const rhinoContext = {
    publicPath: "/keywords/Max-Command_en_wasm_v2_2_0.rhn",
    customWritePath: "2.2.0_Max-Command_en_wasm.rhn",
  }

  const rhinoModel = {
    publicPath: "/models/rhino_params.pv",
    customWritePath: "2.2.0_rhino_params.pv",
  }
  const startRhino = async () => {

    await init(
      "rfAgO8g38Gq/2xPycyvWZWrKJSrV8ES04/yxwl0iyTSXauh0/AtBeg==",
      rhinoContext,
      rhinoModel
    );
    await process()
    console.log("rhino logged")
  }

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      startRhino()
    }

  }, [])

  const endRhino = async () => {

    if (inference !== null) {
      await release()
      onGet(inference.intent)
      onEnd()
      console.log("rhino out")
    }
  }

  useEffect(() => {
    endRhino()
  }, [inference]);

  return (
    <div>
      <h3>Inference:</h3>
      {inference && <pre>{JSON.stringify(inference, null, 2)}</pre>}
    </div>
  );
}

