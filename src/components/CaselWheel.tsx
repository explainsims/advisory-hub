import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { CASEL_DATA, CaselCategory } from '../data/casel';

export default function CaselWheel() {
  const [selectedSection, setSelectedSection] = useState<CaselCategory | null>(null);

  // The ExplAIn Sims Cloudflare Worker serves this app at explainsims.com/<app>/
  // and strips the first segment before forwarding to Cloud Run. The worker's
  // HTMLRewriter does NOT rewrite SVG <image href>, and the document URL may
  // not have a trailing slash, so we can't rely on a relative or root-absolute
  // path. Derive the prefix from the current URL at render time.
  const caselImageSrc = (() => {
    if (typeof window === 'undefined') return '/CASEL.png';
    const firstSegment = window.location.pathname.split('/').filter(Boolean)[0];
    return window.location.hostname.endsWith('explainsims.com') && firstSegment
      ? `/${firstSegment}/CASEL.png`
      : '/CASEL.png';
  })();

  // Wedge angles: 5 wedges, 72 degrees each.
  // 0 is top.
  // We'll calculate SVG paths for the wedges.
  const cx = 500;
  const cy = 500;

  // Helper to calculate SVG arc
  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", start.x, start.y, 
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };

  const describeWedge = (x: number, y: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) => {
    const innerStart = polarToCartesian(x, y, innerRadius, endAngle);
    const innerEnd = polarToCartesian(x, y, innerRadius, startAngle);
    const outerStart = polarToCartesian(x, y, outerRadius, endAngle);
    const outerEnd = polarToCartesian(x, y, outerRadius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M", outerStart.x, outerStart.y,
      "A", outerRadius, outerRadius, 0, largeArcFlag, 0, outerEnd.x, outerEnd.y,
      "L", innerEnd.x, innerEnd.y,
      "A", innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
      "Z"
    ].join(" ");
  };

  function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  // Define rings mathematically based on 1000x1000 viewBox (calculated from 1058 image exact pixel dimensions)
  const centerRadius = 81; 
  const wedgesOuterRadius = 252;
  const ringClassroomRadius = 312;
  const ringSchoolRadius = 372;
  const ringFamilyRadius = 433;
  const ringCommunityRadius = 494;

  const getRingProps = (innerR: number, outerR: number) => {
    const strokeWidth = outerR - innerR;
    return {
      r: (innerR + outerR) / 2,
      strokeWidth: strokeWidth,
    };
  };

  const renderRingEventAndHighlight = (innerR: number, outerR: number) => (
    <>
      <circle cx={cx} cy={cy} {...getRingProps(innerR, outerR)} fill="none" stroke="transparent" style={{ pointerEvents: 'stroke' }} />
      <circle cx={cx} cy={cy} r={outerR - 1.5} fill="none" stroke="#0f172a" strokeWidth="3" className="opacity-0 group-hover:opacity-40 transition-opacity pointer-events-none" />
      <circle cx={cx} cy={cy} r={innerR + 1.5} fill="none" stroke="#0f172a" strokeWidth="3" className="opacity-0 group-hover:opacity-40 transition-opacity pointer-events-none" />
      <circle cx={cx} cy={cy} {...getRingProps(innerR, outerR)} fill="none" stroke="#000" className="opacity-0 group-hover:opacity-[0.04] transition-opacity pointer-events-none" />
    </>
  );

  return (
    <div className="flex flex-col xl:flex-row items-center xl:items-start gap-8 w-full">
      <div className="relative shrink-0 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px]">
        <svg viewBox="0 0 1000 1000" className="w-full h-full drop-shadow-xl" style={{ fontFamily: 'sans-serif' }}>
          
          <defs>
            <clipPath id="wheelClip">
              <circle cx={cx} cy={cy} r={ringCommunityRadius} />
            </clipPath>
          </defs>

          <image href={caselImageSrc} x="0" y="0" width="1000" height="1000" clipPath="url(#wheelClip)" />
          
          {/* Ring 4: Communities */}
          <g 
            onClick={() => setSelectedSection(CASEL_DATA["communities"])}
            className="cursor-pointer group"
          >
            {renderRingEventAndHighlight(ringFamilyRadius, ringCommunityRadius)}
          </g>

          {/* Ring 3: Families & Caregivers */}
          <g 
            onClick={() => setSelectedSection(CASEL_DATA["families"])}
            className="cursor-pointer group"
          >
            {renderRingEventAndHighlight(ringSchoolRadius, ringFamilyRadius)}
          </g>

          {/* Ring 2: Schools */}
          <g 
            onClick={() => setSelectedSection(CASEL_DATA["schools"])}
            className="cursor-pointer group"
          >
            {renderRingEventAndHighlight(ringClassroomRadius, ringSchoolRadius)}
          </g>

          {/* Ring 1: Classrooms */}
          <g 
            onClick={() => setSelectedSection(CASEL_DATA["classrooms"])}
            className="cursor-pointer group"
          >
            {renderRingEventAndHighlight(wedgesOuterRadius, ringClassroomRadius)}
          </g>

          {/* Inner Wedges */}
          <g className="cursor-pointer group" onClick={() => setSelectedSection(CASEL_DATA["self-management"])}>
             <path d={describeWedge(cx, cy, centerRadius, wedgesOuterRadius, 0, 72)} fill="#fff" className="opacity-0 group-hover:opacity-25 mix-blend-overlay transition-opacity" />
          </g>
          <g className="cursor-pointer group" onClick={() => setSelectedSection(CASEL_DATA["responsible-decision-making"])}>
             <path d={describeWedge(cx, cy, centerRadius, wedgesOuterRadius, 72, 144)} fill="#fff" className="opacity-0 group-hover:opacity-25 mix-blend-overlay transition-opacity" />
          </g>
          <g className="cursor-pointer group" onClick={() => setSelectedSection(CASEL_DATA["relationship-skills"])}>
             <path d={describeWedge(cx, cy, centerRadius, wedgesOuterRadius, 144, 216)} fill="#fff" className="opacity-0 group-hover:opacity-25 mix-blend-overlay transition-opacity" />
          </g>
          <g className="cursor-pointer group" onClick={() => setSelectedSection(CASEL_DATA["social-awareness"])}>
             <path d={describeWedge(cx, cy, centerRadius, wedgesOuterRadius, 216, 288)} fill="#fff" className="opacity-0 group-hover:opacity-25 mix-blend-overlay transition-opacity" />
          </g>
          <g className="cursor-pointer group" onClick={() => setSelectedSection(CASEL_DATA["self-awareness"])}>
             <path d={describeWedge(cx, cy, centerRadius, wedgesOuterRadius, 288, 360)} fill="#fff" className="opacity-0 group-hover:opacity-25 mix-blend-overlay transition-opacity" />
          </g>

          {/* Center Circle */}
          <g className="cursor-pointer group" onClick={() => setSelectedSection(CASEL_DATA["sel"])}>
            <circle cx={cx} cy={cy} r={centerRadius - 3} fill="#fff" className="opacity-0 group-hover:opacity-25 mix-blend-overlay transition-opacity" />
            <circle cx={cx} cy={cy} r={centerRadius + 1.5} fill="none" stroke="#0f172a" strokeWidth="3" className="opacity-0 group-hover:opacity-40 transition-opacity pointer-events-none" />
          </g>

        </svg>
      </div>

      {/* Info Panel */}
      <div className="flex-1 w-full bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm min-h-[400px]">
        <AnimatePresence mode="wait">
          {selectedSection ? (
            <motion.div
              key={selectedSection.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-3xl font-bold text-slate-800 mb-4">{selectedSection.title}</h3>
              <div className="prose prose-slate max-w-none">
                <div className="text-slate-600 leading-relaxed mb-6">
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => <p className="mb-4 last:mb-0" {...props} />
                    }}
                  >
                    {selectedSection.description}
                  </ReactMarkdown>
                </div>
                
                {selectedSection.bullets && selectedSection.bullets.length > 0 && (
                  <ul className="list-disc pl-5 mb-6 text-slate-600">
                    {selectedSection.bullets.map((bullet, idx) => (
                      <li key={idx} className="mb-2">
                        <ReactMarkdown components={{ p: 'span' }}>{bullet}</ReactMarkdown>
                      </li>
                    ))}
                  </ul>
                )}
                
                {selectedSection.subcategories && selectedSection.subcategories.map((sub, idx) => (
                  <div key={idx} className="mt-6">
                    <h4 className="text-xl font-semibold text-slate-800 mb-2">{sub.title}</h4>
                    <p className="text-slate-600 leading-relaxed mb-4">{sub.content}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-12"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-slate-300">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
              <p className="text-lg font-medium text-slate-500 mb-2">Select a section</p>
              <p className="max-w-xs">Click on any part of the SEL Framework wheel to see more details.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
