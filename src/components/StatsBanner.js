"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const Counter = ({ value, label }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView && value) {
      let start = 0;
      const end = parseInt(value.replace(/,/g, ""));
      const duration = 2000;
      const incrementTime = duration / (end || 1); // Avoid division by zero

      let timer = setInterval(() => {
        start += Math.ceil((end || 100) / 100);
        if (start > end) start = end;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, 20);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center">
      <h3 className="text-4xl font-bold text-foreground mb-2">{count.toLocaleString()}+</h3>
      <p className="text-primary font-medium uppercase tracking-wider text-sm">{label}</p>
    </div>
  );
};

export default function StatsBanner({ stats }) {
  if (!stats) return null;

  return (
    <div className="bg-primary/5 border-y border-border py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          <Counter value={stats.users?.toString() || "0"} label="Total Users" />
          <Counter value={stats.sessions?.toString() || "0"} label="Sessions Completed" />
          <Counter value={stats.subjects?.toString() || "0"} label="Subjects Offered" />
          <Counter value={stats.countries?.toString() || "12"} label="Countries" />
          <Counter value={stats.hours?.toString() || "1000"} label="Hours Tutored" />
          <div className="text-center">
            <h3 className="text-4xl font-bold text-foreground mb-2">{stats.avgRating?.toFixed(1) || "5.0"}</h3>
            <p className="text-primary font-medium uppercase tracking-wider text-sm">Average Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
}
