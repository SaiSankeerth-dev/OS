# Attribution — OpenMuse

Parts of the `web/om/` package in this repository are adapted from
[OpenMuse](https://github.com/CopilotKit/openmuse) by the OpenMuse
contributors, which is released under the MIT License:

```
MIT License

Copyright (c) 2026 OpenMuse contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

Adapted areas include: the finance CSV analysis (`web/om/finance.py`, ported
from OpenMuse `apps/server/src/engine/finance.ts`), PDF inspection/filling
semantics (`web/om/documents.py`, modeled on
`packages/integrations/src/pdf.ts`), the computer lease/receipt lifecycle
(`web/om/computer.py`, modeled on `apps/server/src/computer.ts`), browser
session persistence (`web/om/browser.py`, modeled on
`apps/server/src/browser.ts`), and the ideas / notifications / threads
concepts from the OpenMuse engine and mobile app. All adapted code was
rewritten for this project's Python/FastAPI stack and local-first
(₹0, no paid APIs) constraints.
