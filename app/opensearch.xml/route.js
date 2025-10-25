import { NextResponse } from "next/server";
import { SITE } from "@/lib/seo";

export function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <ShortName>${SITE.name} Search</ShortName>
  <Description>${SITE.name} site search</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Url type="text/html" template="${SITE.url}/search?q={searchTerms}"/>
</OpenSearchDescription>`;
  return new NextResponse(xml, { headers: { 'Content-Type': 'application/opensearchdescription+xml; charset=UTF-8' } });
}

