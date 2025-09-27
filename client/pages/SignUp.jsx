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
   User,
   Phone,
   GraduationCap,
   CheckCircle,
   AlertCircle,
   ArrowRight,
 } from "@/lib/icons";
 import { Link, useNavigate } from "react-router-dom";
 import { register } from "@/lib/auth";

 export default function SignUp() {
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [formData, setFormData] = useState({
     firstName: "",
     lastName: "",
     email: "",
     phone: "",
     targetInstitution: "",
     password: "",
     confirmPassword: "",
     agreeTerms: false,
   });
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);

   const navigate = useNavigate();

-  const handleSubmit = async (e: React.FormEvent) => {
+  const handleSubmit = async (e) => {
     e.preventDefault();
     setLoading(true);
     setError("");

     // Basic validation
     if (formData.password !== formData.confirmPassword) {
       setError("Passwords do not match");
       setLoading(false);
       return;
     }

     if (!formData.agreeTerms) {
       setError("Please agree to the terms and conditions");
       setLoading(false);
       return;
     }

     try {
       const { dashboardRole } = await register({
         email: formData.email,
         password: formData.password,
         firstName: formData.firstName,
         lastName: formData.lastName,
         phone: formData.phone,
         currentLevel: "BEGINNER",
         examTargets: formData.targetInstitution
           ? [formData.targetInstitution]
           : [],
       });
       navigate(`/dashboard/${dashboardRole}`);
-    } catch (err: any) {
+    } catch (err) {
       setError(err.message || "Failed to create account");
     } finally {
       setLoading(false);
     }
   };

-  const handleChange = (
-    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
-  ) => {
+  const handleChange = (e) => {
     const { name, value, type } = e.target;
-    const checked = (e.target as HTMLInputElement).checked;
+    const checked = e.target.checked;
     setFormData({
       ...formData,
       [name]: type === "checkbox" ? checked : value,
     });
   };