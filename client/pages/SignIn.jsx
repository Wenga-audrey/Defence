@@ .. @@
-import { useState } from "react";
+import React, { useState } from "react";
 import { Button } from "@/components/ui/button";
 import { Card, CardContent } from "@/components/ui/card";
 import { Badge } from "@/components/ui/badge";
 import {
   Mail,
   Lock,
   Eye,
   EyeOff,
   LogIn,
   UserPlus,
   CheckCircle,
   AlertCircle,
   ArrowRight,
   Zap,
   Star,
   Shield,
 } from "@/lib/icons";
 import { Link, useNavigate } from "react-router-dom";
 import { login } from "@/lib/auth";

 export default function SignIn() {
   const [showPassword, setShowPassword] = useState(false);
   const [formData, setFormData] = useState({
     email: "",
     password: "",
     rememberMe: false,
   });
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);

   const navigate = useNavigate();

-  const handleSubmit = async (e: React.FormEvent) => {
+  const handleSubmit = async (e) => {
     e.preventDefault();
     setLoading(true);
     setError("");

     try {
       const { dashboardRole } = await login({
         email: formData.email,
         password: formData.password,
       });
       navigate(`/dashboard/${dashboardRole}`);
-    } catch (err: any) {
+    } catch (err) {
       setError(err.message || "Failed to sign in");
     } finally {
       setLoading(false);
     }
   };

-  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
+  const handleChange = (e) => {
     const { name, value, type, checked } = e.target;
     setFormData({
       ...formData,
       [name]: type === "checkbox" ? checked : value,
     });
   };