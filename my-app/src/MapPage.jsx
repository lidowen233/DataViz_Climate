import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card, CardContent } from "./components/ui/card.jsx";
import * as d3 from "d3";
import { Barplot } from "./Barplot";
import { disasterData, mergedData, mergedCurrentData, mergedRegData, powerData } from "./data/data";
import GniPovertyScatter from "./GniPovertyScatter";
import TimelineBarplot from "./TimelineBarplot";
import { SankeyChart } from "./SankeyChart";
import { RadarChartComponent } from "./RadarChart";
import { GroupedBarChart } from "./GroupedBarplot";
import { LollipopChart } from "./LollipopChart";



mapboxgl.accessToken = "pk.eyJ1Ijoic3liaWx3ZW4yMzMiLCJhIjoiY2x2cHBuMmtkMDRyOTJrbXh4eGhiOWR6cyJ9.1hNSzlQp8mLy37685Fo8Pg";

export default function PacificDisasterMap() {
  const scatterRef = useRef(null);
  const [scatterWidth, setScatterWidth] = useState(600);

  useEffect(() => {
    if (!scatterRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setScatterWidth(entry.contentRect.width);
      }
    });
    observer.observe(scatterRef.current);
    return () => observer.disconnect();
  }, []);

  const mapContainerRef = useRef(null);
  const defaultCountry = "Fiji";

  const [selectedCountry, setSelectedCountry] = useState("Fiji");
  const selectedData = powerData.find((d) => d.name === selectedCountry);

  const [selectedLollipopCountry, setSelectedLollipopCountry] = useState("Fiji");
  //const [selectedCountry, setSelectedCountry] = useState(null);

  const radiusScale = d3.scaleSqrt()
    .domain([d3.min(disasterData, d => d.value), d3.max(disasterData, d => d.value)])
    .range([10, 40]);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [170, -10],
      zoom: 3.2,
      projection: "globe",
    });

    map.on("load", () => {
      map.resize();
      disasterData.forEach((d) => {
        const popup = new mapboxgl.Popup({ offset: 12, closeButton: false }).setHTML(
          `<div style= font-size: 14px; color: #333;">
     <strong style="font-size: 15px; color: #9d174d;">${d.name}</strong><br/>
     ${d.value.toLocaleString()} people affected by disasters
   </div>`
        )

        const el = document.createElement("div");
        el.className = "dot-marker";
        const size = radiusScale(d.value);
        const isSelected = d.name === selectedCountry;
        const baseBorder = isSelected ? "6px solid #9d174d" : "2px solid #9d174d";
        const baseShadow = isSelected ? "0 0 8px #9d174d" : "0 0 6px #9d174d7c";

        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.border = baseBorder;
        el.style.borderRadius = "50%";
        el.style.backgroundColor = "#9d174d7c";
        el.style.boxShadow = baseShadow;
        el.style.cursor = "pointer";

        el.addEventListener("mouseenter", () => popup.setLngLat(d.coordinates).addTo(map));
        el.addEventListener("mouseleave", () => popup.remove());
        el.addEventListener("click", () => {

          document.querySelectorAll(".dot-marker").forEach((marker) => {
            marker.style.border = "2px solid #9d174d";
            marker.style.boxShadow = "0 0 6px #9d174d7c";
          });


          el.style.border = "6px solid #9d174d7c"; // eg. Tailwind gray-900
          el.style.boxShadow = "0 0 8px #9d174d7c";


          setSelectedCountry(d.name);
        });


        new mapboxgl.Marker(el).setLngLat(d.coordinates).addTo(map);
      });
    });

    return () => map.remove();
  }, []);

  const timelineRef = useRef(null);
  const [timelineWidth, setTimelineWidth] = useState(600);

  useEffect(() => {
    if (!timelineRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setTimelineWidth(entry.contentRect.width);
      }
    });
    observer.observe(timelineRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <main className="p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Title */}
        <Card className="w-full mx-auto shadow-md">
          <CardContent className="text-left">
            <h1 className="text-2xl font-bold">Climate Vulnerability in the Pacific</h1>
            <div className="space-y-4 text-sm text-gray-700 leading-relaxed mt-4">
              <p>
                Pacific Island nations stand on the frontlines of the climate crisis. Rising sea levels, extreme weather events, and environmental degradation threaten not just ecosystems—but lives, livelihoods, and national development. Yet the capacity to respond and adapt varies widely between countries.
              </p>
              <p>
                This dashboard brings together data on disaster exposure, socio-economic vulnerability, policy response, and governance readiness. By examining these intersecting dimensions, we aim to uncover which nations are most at risk, who is responding effectively, and where critical gaps remain. Through this lens, we highlight not only the challenges—but also the foundations for building long-term resilience in the Pacific.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 1 */}
        <Card className="w-full mx-auto shadow-md">
          <CardContent className="text-left">
            <h2 className="text-xl font-semibold">Section 1: Who Suffers Most?</h2>
            <p>
              In the Pacific region, vulnerability to natural disasters is shaped not only by geography but also by socio-economic conditions. This section aims to identify which nations and communities face the most severe climate-related impacts and why.
            </p>
            <p>
              <strong className="block text-base text-gray-800 mb-1">Disaster Impact Visualization</strong>
              Using the latest available data, I map the number of people affected by natural disasters over recent years. The size of each circle represents the severity of impact, allowing for a clear comparison across island nations. Additionally, I examine the frequency and types of disasters—such as storm, floods, and droughts—to better understand the patterns of exposure and identify regions most at risk.
            </p>
            <div className="flex flex-row gap-4 w-full mt-4">
              {/* Map - 60% */}
              <div
                ref={mapContainerRef}
                className="rounded-lg overflow-hidden h-[500px] basis-[60%] min-w-[400px]"
              ></div>

              {/* Sankey - 40% */}
              <div className="basis-[40%] min-w-[300px]">
                <SankeyChart
                  data={disasterData}
                  highlightCountry={selectedCountry}
                  onHighlightCountryChange={setSelectedCountry}
                  width={600}
                  height={500}
                />
              </div>
            </div>
            <div className="space-y-4 text-sm text-gray-700 leading-relaxed mt-4">
              <p>Based on the analysis, I found <strong>Marshall Islands</strong> has the <strong>highest number of people affected (52,914)</strong> despite relatively few disaster events — highlighting <strong>extreme vulnerability</strong>.
                <strong> Solomon Islands</strong> & <strong>Micronesia</strong> show high disaster impact, indicating <strong>limited resilience</strong>.
                <strong> Fiji</strong> experiences the <strong>most frequent storms (20)</strong>, but with comparatively lower affected population — suggesting <strong>better preparedness</strong>.
                <strong> Vanuatu</strong> & <strong>Papua New Guinea</strong> are hotspots of <strong>volcanic activity</strong>, while <strong> Papua New Guinea</strong> also faces the <strong>highest earthquake risk</strong>.
                <strong> Tuvalu</strong> & <strong>Kiribati</strong> as <strong>small island nations</strong>, they are <strong>highly sensitive</strong> — even a few disasters can cause major disruption.
              </p>

              <p>
                Disaster frequency does not always equal disaster impact. Countries with fewer events may still suffer more due to <strong>weaker infrastructure</strong>, <strong>limited response systems</strong>, and <strong>higher exposure per capita</strong>.
              </p>
            </div>

            {/* Radar Chart Section */}
            <div className="w-full mt-10">

              <p>
                Beyond exposure, I assess each nation's underlying social vulnerability through five key indicators:</p>
              <ul className="list-disc list-inside mt-1 ml-4 space-y-1">
                <li><strong>Essential Health Services Coverage (%)</strong> – the ability to access basic healthcare during and after disasters.</li>
                <li><strong>Poverty Rate (%)</strong> – the proportion of population living under poverty, limiting adaptive capacity.</li>
                <li><strong>Unemployment Rate (%)</strong> – reflecting economic fragility.</li>
                <li><strong>NEET Youth (%)</strong> – the percentage of young people not in education, employment, or training, indicating intergenerational vulnerability.</li>
                <li><strong>GNI per capita ($)</strong> – a proxy for national-level economic resilience.</li>
              </ul>

              <p className="text-sm mb-4 text-gray-600">
                These combined insights help us understand not just the locations of disasters, but also which nations face the greatest challenges in coping and recovering. The radar chart shows how these nations face multiple overlapping vulnerabilities.
                This understanding leads us into the next sections, where I explore how governance and policy shape resilience.</p>

              {/* Buttons */}
              <div className="flex justify-center">
                <div className="grid grid-cols-5 gap-3">
                  {mergedData.map((d) => (
                    <button
                      key={d.name}
                      onClick={() => setSelectedCountry(d.name)}
                      className={`w-28 h-10 rounded text-sm font-medium text-black bg-white text-center transition-all duration-200
          ${selectedCountry === d.name
                          ? "border-2 border-red"
                          : "border border-black"
                        }`}
                    >
                      {d.name}
                    </button>
                  ))}
                </div>
              </div>
              {/* Radar Chart */}
              <div className="w-full max-w-xl mx-auto bg-gray-50 rounded shadow p-4 mt-6">
                <RadarChartComponent
                  country={
                    mergedData.find((d) => d.name === selectedCountry) ||
                    mergedData.find((d) => d.name === "Fiji")
                  }
                />
              </div>
              <div className="space-y-4 text-sm text-gray-700 leading-relaxed mt-4"> <p>Based on the analysis, I found <span className="text-red-700 font-medium">Papua New Guinea</span> (52.21%) and <span className="text-red-700 font-medium">Solomon Islands</span> (40.3%) have the highest poverty levels, indicating deep-rooted socioeconomic vulnerability. <span className="text-orange-700">Papua New Guinea</span> has the lowest essential health services coverage (30.39%), followed by <span className="text-orange-700">Vanuatu</span> and <span className="text-orange-700">Micronesia</span> (~47%), limiting resilience to health-related disasters.  <span className="text-rose-700">Kiribati</span> (53.67%) and <span className="text-rose-700">Vanuatu</span> (47.53%) show alarmingly high NEET rates, reflecting a lack of youth engagement in education or employment. <span className="text-lime-700">Tuvalu</span> (GNI: $8,770) and <span className="text-lime-700">Marshall Islands</span> ($7,860) have the highest per capita income, while <span className="text-gray-600">Solomon Islands</span> and <span className="text-gray-600">Papua New Guinea</span> fall behind (~$2,100–$2,800), reflecting economic inequality. <span className="text-blue-700">Marshall Islands</span> (-3.9%) and <span className="text-blue-700">Tonga</span> (-2.3%) saw economic contraction, raising concerns about fiscal capacity to recover from shocks. No single indicator tells the full story—countries like <strong>Kiribati</strong> and <strong>Vanuatu</strong> face overlapping challenges across poverty, youth disengagement, and health service gaps, requiring integrated resilience strategies. </p> </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2 */}
        <Card className="w-full mx-auto shadow-md">
          <CardContent className="text-left">
            <h2 className="text-xl font-semibold">Section 2: Who Is Responding Best?</h2>
            <p>
              Building resilience is not only about recognizing risk—it’s also about action.This section compares national-level policies and energy transitions related to climate mitigation.    In this section, I examine how different Pacific nations are responding to climate challenges through governance, policy, and sustainable transitions.
            </p>

            <p>
              <strong>Land-based Response Indicators:</strong><br />
              On land, I assess formal policy commitments and local-level implementation. This includes:
            </p>
            <ul className="list-disc list-inside mt-1 ml-4 space-y-1">
              <li>The year since which legislative and/or regulatory provisions have been established for managing disaster risk.</li>
              <li>The proportion of local governments that adopt and implement local disaster risk reduction strategies.</li>
              <li>The share of renewable energy in each country’s overall energy mix.</li>
            </ul>

            <p className="mt-4">
              <strong>Ocean-based Response Indicators:</strong><br />
              Coastal and marine ecosystems are vital for both livelihoods and resilience. To understand how well these environments are being protected, I include:
            </p>
            <ul className="list-disc list-inside mt-1 ml-4 space-y-1">
              <li>Protected area coverage for marine Key Biodiversity Areas (KBA).</li>
              <li>Density of beach litter (per square kilometer).</li>
              <li>The Red List Index, which reflects the extinction risk of native species.</li>
            </ul>

            <p className="mt-4">
              Together, these indicators help us explore whether stronger governance responses are aligned with a country’s climate vulnerability—offering insight into gaps, progress, and opportunities.
            </p>
            <div ref={timelineRef} className="w-full bg-gray-100 rounded-lg p-4">

              <TimelineBarplot data={mergedRegData} svgWidth={1300} />
            </div>
            <div className="space-y-4 text-sm text-gray-700 leading-relaxed mt-4">
              <p>
                <strong>Tuvalu</strong> and <strong>Vanuatu</strong> stand out with <strong>100% implementation</strong> of local disaster risk reduction strategies, reflecting strong national commitment. However, countries like <strong>Fiji</strong>, <strong>Solomon Islands</strong>, and <strong>Samoa</strong> show <strong>0% implementation</strong> despite having disaster management laws in place—indicating a clear policy-to-action gap. In marine conservation, <strong>Kiribati</strong> leads with <strong>32.92%</strong> marine protected area coverage, followed by <strong>Fiji</strong> at <strong>14.57%</strong>, while <strong>Tuvalu</strong> and <strong>Micronesia</strong> remain below 2%. <strong>Papua New Guinea</strong> and <strong>Solomon Islands</strong> have made the most progress in renewable energy use (above 50%), contrasting sharply with <strong>Tonga</strong> and <strong>Micronesia</strong> which are below 3%. In terms of pollution, <strong>Tonga</strong> and <strong>Samoa</strong> face alarming coastal waste densities—over <strong>2 million</strong> and <strong>8 million pieces</strong> per square kilometer—raising serious environmental concerns. Despite similar biodiversity threat levels across nations (Red List Index ~0.66–0.82), <strong>Vanuatu</strong> and <strong>Micronesia</strong> sit at the lower end, suggesting higher ecological vulnerability. These patterns reveal that while policies and energy targets exist, the real test lies in implementation and sustained environmental governance.
              </p>
            </div>

          </CardContent>
        </Card>

        {/* Section 3 */}
        <Card className="w-full mx-auto shadow-md">
          <CardContent className="text-left">
            <h2 className="text-xl font-semibold">Section 3: Resource ≠ Capacity</h2>
            <p>
              While some Pacific nations benefit from tourism, remittances, and foreign aid, high economic potential does not always translate into effective climate resilience. In this section, I explore whether a country’s resource foundation is matched by the capacity to govern and deliver resilience.
            </p>

            <p>
              <strong>Economic Foundations:</strong><br />
              I begin by visualizing key resource streams—tourism, remittances, foreign aid, and government revenue—as a percentage of each country’s GDP. These economic inputs represent the financial or institutional potential a nation might use to prepare for and respond to disasters.
            </p>

            <p className="mt-4">
              <strong>GDP Trends Over Time:</strong><br />
              To provide additional context, I include a line chart showing GDP growth or decline over recent years. This helps evaluate the stability or volatility of a country’s economic base and its potential to sustain resilience strategies.
            </p>

            <p className="mt-4">
              Ultimately, this section reveals the gap that can exist between available resources and actual readiness. Having wealth or external support is not enough—governance structures, digital infrastructure, and institutional mechanisms remain essential to turn resources into resilience.
            </p>



            <div className="w-full bg-gray-100 rounded-lg p-4 my-6">
              <GroupedBarChart data={mergedCurrentData} />
            </div>

            <div className="space-y-4 text-sm text-gray-700 leading-relaxed mt-4">
              <p>
                Resource availability across Pacific nations reveals sharp contrasts between economic potential and structural capacity. <strong>Kiribati</strong> and <strong>Marshall Islands</strong> rely heavily on <strong>government revenue</strong> (94.08% and 73.16% of GDP, respectively), despite having <strong>minimal tourism activity</strong> and <strong>low foreign investment</strong>. <strong>Tonga</strong> and <strong>Samoa</strong> receive the highest <strong>remittance inflows</strong> (41.94% and 28.24%), suggesting strong diaspora support as a resilience lifeline. <strong>Vanuatu</strong> and <strong>Solomon Islands</strong> benefit from relatively high <strong>tourism contributions</strong> (10.4% and 10.5%), yet their economies remain small. Meanwhile, <strong>Fiji</strong> leads in <strong>FDI and ODA volume</strong>, reflecting its larger economy and regional connectivity. However, countries like <strong>Micronesia</strong> and <strong>Tuvalu</strong> exhibit <strong>near-zero foreign investment</strong>, raising concerns about external dependency and isolation. These disparities underline that <strong>economic resources alone do not equate to climate resilience</strong>; the ability to harness and govern those resources is critical.
              </p>
            </div>


            <div className="space-y-2 text-sm text-gray-600">
              <strong>Does resource guarantee resilience? </strong>
              <p>
                While some Pacific nations benefit from tourism, remittances, or development aid,
                resilience is not only about resource—but about how it is governed and delivered.
                I examine three pillars of actual governance capacity:
              </p>
              <ul className="list-disc pl-5">
                <li>Is the country ready for disaster-related health shocks?</li>
                <li>Can people receive warnings, updates, and support digitally?</li>
                <li>Are there constitutional or statutory tools ensuring transparent, inclusive responses?</li>
              </ul>
            </div>
            <p className="mt-4">
              To better understand these pillars, we assess each country's practical governance infrastructure using a set of indicators:
            </p>
            <ul className="list-disc list-inside mt-1 ml-4 space-y-1">
              <li><strong>International Health Regulations (IHR) capacity</strong> — indicating readiness for cross-border health emergencies.</li>
              <li><strong>Multi-sectoral NCD strategy</strong> — reflecting how broadly governments address chronic health risks.</li>
              <li><strong>Internet subscriptions per 100 people</strong> — capturing digital connectivity and access to online information.</li>
              <li><strong>Online Service Index</strong> — measuring the availability of public services online.</li>
              <li><strong>WGI: Government Effectiveness</strong> — assessing how well governments formulate and implement policy.</li>
              <li><strong>WGI: Rule of Law</strong> — indicating the extent to which laws are respected and enforced.</li>
              <li><strong>WGI: Regulatory Quality</strong> — measuring the ability to formulate sound policies and regulations.</li>
            </ul>

            <p className="mt-4">
              Together, these indicators provide a holistic picture of how well each nation can translate resources into actionable resilience.</p>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              <div className="grid grid-cols-5 gap-3">
                {powerData.map((d) => (
                  <button
                    key={d.name}
                    onClick={() => setSelectedLollipopCountry(d.name)}
                    className={`px-3 py-1 border rounded bg-black ${selectedLollipopCountry === d.name ? "bg-black text-white" : "bg-white text-black"
                      }`}
                  >
                    {d.name}
                  </button>
                ))}
              </div>

              <div className="mt-10 w-full bg-gray-100">
                <h2 className="text-xl font-bold mb-4 text-center">
                  Governance Capacity – {selectedLollipopCountry}
                </h2>
                <LollipopChart data={powerData.find(d => d.name === selectedLollipopCountry)} />
              </div>
              <div className="space-y-4 text-sm text-gray-700 leading-relaxed mt-4">
                <p>
                  Governance capacity and digital readiness vary widely across Pacific nations. <strong>Fiji</strong> stands out with the <strong>highest health emergency preparedness (IHR 98.2)</strong> and relatively strong e-government service. In contrast, <strong>Vanuatu</strong> and <strong>Tuvalu</strong> exhibit <strong>low IHR scores</strong> (34.7 and 54.0), despite strong legal institutions in Tuvalu (Rule of Law 1.01). <strong>Micronesia</strong> reports <strong>the highest internet access rate</strong> (5.82 per 100 people), but <strong>zero national NCD policies</strong>, raising questions about coordination. <strong>Tonga</strong> shows robust NCD strategies, yet lags in government effectiveness and regulatory quality. While <strong>Samoa</strong> and <strong>Marshall Islands</strong> enjoy high scores in legal accountability (Rule of Law bigger than 0.6), their online services remain modest. Overall, the data reveal <strong>uneven digital infrastructure, public health preparedness, and institutional quality</strong>—all critical for coordinated climate and disaster response.
                </p>
              </div>

            </div>

          </CardContent>
        </Card>

        {/* Conclusion */}
        <Card className="w-full mx-auto shadow-md">
          <CardContent>
            <h2 className="text-xl font-semibold">Conclusion</h2>
            <p className="break-words whitespace-normal">
              Across the Pacific, vulnerability to climate disasters is not only a matter of exposure but of <strong>capacity, coordination, and governance</strong>. While some nations benefit from strong economic inflows—via tourism, remittances, or aid—these alone do not ensure resilience. The ability to respond effectively depends on <strong>health preparedness, digital access, and institutional quality</strong>. Countries like <strong>Fiji</strong> and <strong>Samoa</strong> show more balanced readiness, while others face critical gaps in coordination, communication, or policy enforcement. To strengthen climate resilience, Pacific nations must invest not just in resources—but in the systems that deliver and manage them.
            </p>
          </CardContent>
        </Card>
      </div>
    </main >
  );

}



