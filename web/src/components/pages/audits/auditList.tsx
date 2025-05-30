"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuditRow } from "./auditRow";
import { BookPlus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Audit from "@/models/Audit";

export function AuditList() {
  const guid = "942a8d76-d119-4e82-a269-63f29126d4a4";

  const [addAuditNameInput, setAuditNameInput] = useState("");
  const [loggedInState, setLoggedInState] = useState(false);
  const [auditList, setAuditList] = useState<Audit[]>([]);

  const fetchAudits = useCallback(async () => {
    const getOwnersUrl =
      process.env.NEXT_PUBLIC_API_URL + "/api/audit/auditList";

    const formData = new FormData();
    formData.append("guid", guid);

    fetch(getOwnersUrl, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setAuditList(data);
      });
  }, [guid]);

  useEffect(() => {
    if (loggedInState) {
      fetchAudits();
    }
  }, [loggedInState, fetchAudits]);

  const addAudit = async () => {
    const fetchUrl = process.env.NEXT_PUBLIC_API_URL + "/api/audit/addAudit";

    const formData = new FormData();
    formData.append("guid", guid);
    formData.append("name", addAuditNameInput);

    const res = await fetch(fetchUrl, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      fetchAudits();
    }
  };

  const onAddAuditNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuditNameInput(e.target.value);
  };
  return (
    <div className="flex flex-col h-screen">
      <h1 className="h-35">Audits</h1>

      <div className="flex flex-row">
        <Input
          value={addAuditNameInput}
          onChange={onAddAuditNameChange}
          placeholder="Audit Name"
        />
        <Button onClick={addAudit} className="bg-emerald-500">
          <BookPlus />
        </Button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Audit Name</th>
            <th>Entries</th>
            <th>Public Guid</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {auditList?.length > 0 ? (
            auditList?.map((audit) => (
              <AuditRow
                key={audit.id}
                audit={audit}
                onSubmitDone={fetchAudits}
                onDelete={fetchAudits}
              />
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center">
                No Audits Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
