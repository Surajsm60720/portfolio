"use client";

import ScrollReveal  from "./ui/ScrollReveal";

export default function AboutSection(){
    return(
        <ScrollReveal
            scrollContainerRef={null}
            baseOpacity={0}
            enableBlur={true}
            baseRotation={6}
            blurStrength={10}
        >
        I am currently a final year student in Dept. of Information Science & Engg. at DSCE, Bengaluru.
        With a strong foundation in both front-end and back-end technologies, I thrive on creating seamless user experiences and efficient server-side solutions.
        I am dedicated to continuous learning and staying updated with the latest industry trends to deliver innovative solutions that meet client needs.
        </ScrollReveal>
    );
}
