'use client';
import * as React from 'react';
import { Tabs as TabsPrimitive } from 'radix-ui';

// Unstyled on purpose: the one place that uses tabs (the Experience bar) brings its own look.
function Tabs(props: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot='tabs' {...props} />;
}

function TabsList(props: React.ComponentProps<typeof TabsPrimitive.List>) {
  return <TabsPrimitive.List data-slot='tabs-list' {...props} />;
}

function TabsTrigger(props: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return <TabsPrimitive.Trigger data-slot='tabs-trigger' {...props} />;
}

function TabsContent(props: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot='tabs-content' {...props} />;
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
