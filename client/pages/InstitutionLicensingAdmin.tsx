import React, { useEffect, useState } from "react";
import { api } from "@shared/api";
import { Card, CardHeader, CardTitle, CardContent, Button } from "@/components/ui/card";

export default function InstitutionLicensingAdmin() {
  const [institutions, setInstitutions] = useState([]);
  const [pending, setPending] = useState([]);

  useEffect(() => {
    async function fetchInstitutions() {
      const res = await api.get("/api/institution/licensing/list");
      if (res.success) setInstitutions(res.institutions);
      const pend = await api.get("/api/institution/pending");
      if (pend.success) setPending(pend.pending);
    }
    fetchInstitutions();
  }, []);

  async function handleApprove(id) {
    await api.post("/api/institution/licensing/approve", { institutionId: id, terms: "Standard terms" });
    setPending(pending.filter(inst => inst.id !== id));
    // Optionally refetch institutions
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Institutional Licensing</CardTitle>
      </CardHeader>
      <CardContent>
        <h4>Licensed Institutions</h4>
        <ul>
          {institutions.map(i => <li key={i.id}>{i.name}</li>)}
        </ul>
        <h4 className="mt-4">Pending Approvals</h4>
        <ul>
          {pending.map(p => (
            <li key={p.id}>
              {p.name} <Button onClick={() => handleApprove(p.id)}>Approve</Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}