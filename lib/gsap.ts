"use client"

/**
 * Central GSAP setup — plugins are registered exactly once here.
 * Import gsap/useGSAP/ScrollTrigger/SplitText from this module,
 * never from "gsap" directly, so registration is guaranteed.
 */
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

gsap.defaults({ ease: "power3.out", duration: 0.7 })

export { gsap, useGSAP, ScrollTrigger, SplitText }
