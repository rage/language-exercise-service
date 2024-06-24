/* eslint-disable i18next/no-literal-string */
import { NextApiRequest, NextApiResponse } from "next"

import { isSpecRequest } from "@/shared-module/common/bindings.guard"
import { PublicSpec } from "@/protocolTypes/publicSpec"
import { v4 } from "uuid"

export default (req: NextApiRequest, res: NextApiResponse): void => {
  if (req.method === "OPTIONS") {
    res.status(200).end()
    return
  }
  if (req.method !== "POST") {
    return res.status(404).json({ message: "Not found" })
  }

  try {
    return handlePost(req, res)
  } catch (e) {
    console.error("Public spec request failed:", e)
    if (e instanceof Error) {
      return res.status(500).json({
        error_name: e.name,
        error_message: e.message,
        error_stack: e.stack,
      })
    } else {
      return res.status(500).json({ error_message: e })
    }
  }
}

function handlePost(req: NextApiRequest, res: NextApiResponse) {
  if (isSpecRequest(req.body.private_spec)) {
    throw new Error("Invalid request")
  }
  const publicSpec: PublicSpec = {
    version: 1,
    exerciseType: "dragging",
    items: [
      {
        id: v4(),
        text: [
          { type: "text", text: "Today I " },
          { type: "slot" },
          { type: "text", text: "Yes " },
        ],
      },
    ],
    allOptions: ["a", "b", "c"],
  }
  return res.status(200).json(publicSpec)
}
