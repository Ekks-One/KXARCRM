'use client';

import "@/app/pages/database/pageStyle.css";
import React, { useState } from 'react';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import { ShowPatients } from "@/app/pages/database/tables/patients";

export function Medical() {

  return (
    <Card className="m-8 p-8">
      <div>
        <CardHeader>
          <CardTitle>Medical Dashboard</CardTitle>
        </CardHeader>

        <CardContent>
          <ShowPatients />
        </CardContent>
      </div>
    </Card>
  );
}
