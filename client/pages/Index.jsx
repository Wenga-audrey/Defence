@@ .. @@
-import { useState, useEffect } from "react";
-import { useNavigate } from "react-router-dom";
+import React, { useState, useEffect } from "react";
+import { useNavigate } from "react-router-dom";
 import { Button } from "@/components/ui/button";
 import { Card, CardContent } from "@/components/ui/card";
 import { Badge } from "@/components/ui/badge";
 import {
   ArrowRight,
   Play,
   GraduationCap,
   Users,
   Trophy,
   Clock,
   CheckCircle,
   Star,
   X,
 } from "@/lib/icons";
 import Header from "@/components/Header";
 import Footer from "@/components/Footer";
 import { useAuth } from "@/hooks/use-auth";

 // Counter Animation Hook
-function useCounter(end: number, duration: number = 2000) {
+function useCounter(end, duration = 2000) {
   const [count, setCount] = useState(0);
   const [isVisible, setIsVisible] = useState(false);

   useEffect(() => {
     if (!isVisible) return;

-    let startTime: number | null = null;
+    let startTime = null;

-    const animate = (currentTime: number) => {
+    const animate = (currentTime) => {
       if (startTime === null) startTime = currentTime;
       const progress = Math.min((currentTime - startTime) / duration, 1);

       setCount(Math.floor(progress * end));

       if (progress < 1) {
         requestAnimationFrame(animate);
       }
     };

     requestAnimationFrame(animate);
   }, [end, duration, isVisible]);

   return { count, setIsVisible };
 }

 // Counter Component
-function Counter({
-  end,
-  suffix = "",
-  prefix = "",
-  duration = 2000,
-}: {
-  end: number;
-  suffix?: string;
-  prefix?: string;
-  duration?: number;
-}) {
+function Counter({ end, suffix = "", prefix = "", duration = 2000 }) {
   const { count, setIsVisible } = useCounter(end, duration);

   useEffect(() => {
     const observer = new IntersectionObserver(
       ([entry]) => {
         if (entry.isIntersecting) {
           setIsVisible(true);
         }
       },
       { threshold: 0.1 },
     );

     const element = document.getElementById(`counter-${end}`);
     if (element) observer.observe(element);

     return () => observer.disconnect();
   }, [setIsVisible, end]);

   return (
     <span id={`counter-${end}`}>
       {prefix}
       {count}
       {suffix}
     </span>
   );
 }