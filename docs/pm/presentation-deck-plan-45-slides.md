# DormCare Hub / QLKTX - Deck Plan 45 Slides

| Field | Value |
| --- | --- |
| Project | DormCare Hub / QLKTX |
| Document ID | DCH-PMO-DECK-45 |
| Purpose | Noi dung thuyet trinh 45 slide de 7 thanh vien chuyen thanh PPTX/Google Slides |
| Audience | Giang vien, lop hoc, stakeholder gia lap cua du an quan ly KTX |
| Duration | 35-45 phut trinh bay + Q&A |
| Owner | Group 3 |
| Updated | 2026-07-07 |

## Tom Tat Dieu Huong

Deck nay bam sat cau hoi cua thay, nhung khong tra loi theo kieu liet ke roi roi. Workflow chay theo mot cau chuyen:

1. San pham tao gia tri gi cho khach hang KTX.
2. Nhom to chuc con nguoi va cong viec ra sao de lam duoc san pham.
3. Tien do thuc te va van hanh hien tai co on khong.
4. Rui ro, quyet dinh A/B va storyboard trai nghiem nguoi dung.
5. Demo first release: du xai cho mon hoc, chua goi la production-ready cho nguoi dung that.

Moi slide chi giu mot thong diep chinh. Khi dung thanh PPTX, uu tien hinh, bang, flow, screenshot; khong dua nguyen speaker note len slide.

## Phan Vai

| Thanh vien | Slide | Vai trinh bay | Trong tam noi |
| --- | --- | --- | --- |
| TV1 | 01-06 | Product/customer owner | Product la gi, khach hang dau o dau, charter/feasibility tong quan |
| TV2 | 07-13 | Product/BA | Feasibility chi tiet, core features, business value |
| TV3 | 14-21 | PM theory/PoC owner | Backlog, estimate, fixed-date, process, DoD, PoC, first release du xai |
| TV4 | 22-27 | Team/work owner | So do nhom, RACI, tracking tung member |
| TV5 | 28-33 | Progress/operator | Tien do, burndown, velocity, van hanh OK/chua OK, giai phap |
| TV6 | 34-39 | Risk owner | Risk theory, A/B, decision, mitigation |
| TV7 | 40-45 | Storyboard/demo owner | User journey, demo script, Q&A |

## Quy Uoc Thiet Ke

- Ty le slide: `16:9`.
- Phong cach: operational SaaS, quan ly KTX, ro rang, dung nhieu visual.
- Mau de xuat: teal `#0F766E`, xanh duong `#2563EB`, xam `#64748B`, canh bao `#F59E0B`, nguy co `#DC2626`.
- Moi slide co footer nho: `Group 3 - DormCare Hub | Week 10 Progress | Sxx`.
- Neu can rut gon con 30 slide: gop `07-09`, `13-15`, `21-24`, `31-36`.

---

## Slide 01 - Cover: DormCare Hub / QLKTX

**Nguoi noi:** TV1  
**Phan:** Mo dau  
**Thong diep:** Nhom da co first release du xai, chay that, phuc vu bai toan quan ly KTX.

**Noi dung tren slide:**

- DormCare Hub / QLKTX.
- He thong Quan ly Ky tuc xa.
- Bao cao tien do tuan 10 - Group 3.
- Tagline: `Ho so -> Phan phong -> Check-in/out -> SLA -> Dashboard`.
- Moc cap nhat: `2026-07-07`.

**Visual can dung:**

- Mockup man hinh dashboard KTX tren laptop.
- Nen trang/sang, logo/chu DormCare Hub lon.
- 4 KPI nho tren mockup: occupancy, pending applications, overdue tickets, available beds.

**Speaker note:** Chao thay va lop. Mo dau bang thong diep: day khong chi la y tuong hay prototype tinh; nhom da co ban chay that du de demo luong nghiep vu cot loi.

**Nguon:** `project-overview.md`, `progress-report-week10.md`.

---

---

## Slide 02 - Lo Trinh Trinh Bay

**Nguoi noi:** TV1  
**Phan:** Mo dau  
**Thong diep:** Bai trinh bay tra loi dung 4 nhom cau hoi cua thay va ket bang demo first release.

**Noi dung tren slide:**

1. Tom tat thong tin du an theo goc nhin khach hang.
2. Quan ly nhan su va phan cong cong viec.
3. Bao cao tien do thuc te va van hanh.
4. Quan tri rui ro va storyboard.
5. Demo first release va Q&A.

**Visual can dung:**

- Timeline ngang 5 buoc.
- Moi buoc 1 icon: customer, team, progress, risk, demo.

**Speaker note:** Noi ro deck nay khong doc lai tai lieu PM; moi phan gan truc tiep voi san pham dang chay va bang chung.

**Nguon:** Cau hoi yeu cau cua giang vien, `presentation-deck-plan-45-slides.md`.

---

---

## Slide 03 - Product La Gi?

**Nguoi noi:** TV1  
**Phan:** 1 - Tom tat du an theo goc nhin khach hang  
**Thong diep:** DormCare Hub thay the Excel, giay to, Zalo bang mot he thong quan ly KTX tap trung.

**Noi dung tren slide:**

- Product: web-responsive dormitory management system.
- Nguoi dung chinh: sinh vien, staff KTX, bao tri, lanh dao/CTSV, admin.
- Du lieu cot loi: ho so, phong/giuong, phan cong, ticket, KPI.
- Gia tri cot loi: mot nguon du lieu dung cho toan bo vong doi KTX.

**Visual can dung:**

- Before/after.
- Ben trai: Excel, Zalo, giay to, file roi rac.
- Ben phai: 1 dashboard tap trung co sidebar Student/Staff/Admin.

**Speaker note:** Giai thich bang ngon ngu khach hang: phong KTX khong can tong hop thu cong tu nhieu kenh nua; sinh vien nhin duoc trang thai, staff thao tac tren cung mot so lieu.

**Nguon:** `project-overview.md`.

---

---

## Slide 04 - Bai Toan Khach Hang

**Nguoi noi:** TV1  
**Phan:** 1  
**Thong diep:** San pham duoc tao ra tu cac noi dau van hanh co that trong KTX.

**Noi dung tren slide:**

| Nhom nguoi dung | Noi dau hien tai | DormCare Hub giai quyet |
| --- | --- | --- |
| Sinh vien | Khong biet ho so dang o dau | Trang thai va timeline minh bach |
| Staff KTX | So phong/giuong lech, cap nhat tay | Ledger phong/giuong theo workflow |
| Staff phan phong | Phan phong thu cong, kho giai thich | Suggestion co reason code |
| Bao tri | Ticket that lac, khong ro han SLA | SLA board, assignee, due time |
| Lanh dao/Admin | Bao cao cham, thieu audit | KPI va audit log |

**Visual can dung:**

- Pain point map 5 nhom nguoi dung.
- Moi nhom 1 card co icon va 1 cau ngan.

**Speaker note:** Diem quan trong la san pham khong lam mot CRUD chung chung; moi feature sinh ra tu mot diem dau van hanh.

**Nguon:** `project-overview.md`, `prototype-spec.md`.

---

---

## Slide 05 - Gia Tri Cho Khach Hang

**Nguoi noi:** TV1  
**Phan:** 1  
**Thong diep:** Gia tri nam o minh bach, giam sai lech, tang toc xu ly va co truy vet.

**Noi dung tren slide:**

| Gia tri | Bieu hien trong san pham |
| --- | --- |
| Minh bach | SV thay trang thai ho so, ket qua duyet, phong/giuong |
| Chinh xac | Ledger cap nhat sau assign, check-in, check-out |
| Giai thich duoc | Goi y phan phong kem rule reasons |
| Co trach nhiem | Override, duyet, check-out bat buoc ly do |
| Hanh dong duoc | KPI dashboard link ve danh sach can xu ly |

**Visual can dung:**

- Value matrix 5 cot.
- Moi cot co icon: eye, database, list-check, shield, arrow-right.

**Speaker note:** Nhac lai yeu cau dashboard: KPI khong phai trang tri; moi KPI phai dan toi record/action.

**Nguon:** `definition-of-done.md`, `prototype-spec.md`.

---

---

## Slide 06 - Uy Nhiem Du An (Project Charter)

**Nguoi noi:** TV1  
**Phan:** 1 - Tom tat du an theo goc nhin khach hang  
**Thong diep:** Charter chot muc tieu, sponsor, pham vi va nguon luc truoc khi lam.

**Noi dung tren slide:**

| Yeu to | Noi dung |
| --- | --- |
| Muc tieu | So hoa vong doi KTX: ho so -> phan phong -> check-in/out -> SLA |
| Sponsor | Giang vien huong dan (danh gia ket qua, phe duyet scope lon) |
| Pham vi | MVP web-responsive, 13 Must story / 74 SP |
| Nguon luc | Nhom 7 sinh vien, cloud tier free (Supabase/Azure) |
| KPI chien luoc | >=90% ho so xu ly trong he thong, >=95% so giuong dung |

**Visual can dung:**

- 5 card ngang, moi card 1 icon (target, user, box, users, chart).
- Badge "Charter approved" o goc.

**Speaker note:** Noi Charter la cam ket ban dau; moi thay doi scope lon deu doi chieu lai Charter va release plan.

**Nguon:** `Hien Chuong Du An.docx`, `project-overview.md`.

---

## Slide 07 - San Pham Co Di Dung Huong Feasibility Khong?

**Nguoi noi:** TV1  
**Phan:** 1  
**Thong diep:** Co. San pham hien tai dung huong kha thi ban dau, nhung van can hardening truoc pilot that.

**Noi dung tren slide:**

| Tieu chi feasibility | Ket qua hien tai | Trang thai |
| --- | --- | --- |
| Ky thuat | React web + Backend Azure + Supabase, E2E pass | Pass |
| Kinh te | Web-responsive, cloud tier, khong native app trong MVP | Pass |
| Phap ly/quy trinh | Consent, RBAC, audit; dev bypass can tat | Pass co canh bao |
| Van hanh | 2 luong critical demo duoc | Pass |

**Visual can dung:**

- 4 quadrant feasibility.
- Badge xanh cho pass, vang cho "can hardening".

**Speaker note:** Dung cau chot trung thuc: "Di dung huong, nhung chua goi la san pham san sang pilot that neu chua tat dev bypass va do coverage."

**Nguon:** `project-overview.md`, `risk-management.md`, `progress-report-week10.md`.

---

---

## Slide 08 - Kha Thi Ky Thuat

**Nguoi noi:** TV2  
**Phan:** 1  
**Thong diep:** Kien truc da chay tren ha tang that, khong chi la mock prototype.

**Noi dung tren slide:**

- Frontend: Vite + React + TypeScript.
- UI: shadcn components + lucide icons.
- Backend: Express REST API.
- Database: PostgreSQL/Supabase.
- Deployment demo: Azure App Service.
- Integration: frontend goi backend qua `src/lib/api/repositories.ts`, co `mock|live` mode.

**Visual can dung:**

- Architecture light: Browser -> React frontend -> API repositories -> Azure API -> Supabase PostgreSQL.
- Them icon "mock mode" va "live mode".

**Speaker note:** Nhan manh repo frontend khong goi fetch lung tung; data di qua repository layer de doi mock/live an toan.

**Nguon:** `implementation-traceability.md`, `AGENTS.md`, `frontend-architecture.md`.

---

---

## Slide 09 - Kha Thi Kinh Te

**Nguoi noi:** TV2  
**Phan:** 1  
**Thong diep:** MVP toi uu chi phi bang web-responsive va cloud managed, khong lam nhung thu ngoai pham vi.

**Noi dung tren slide:**

- MVP dung web-responsive thay native mobile.
- Dung cloud managed de giam cong van hanh ha tang.
- Release 1 chi bao ve 13 Must story, 74 SP.
- Deferred: SIS sync, payment gateway that, native mobile, export nang cao.
- Phase 2 chi mo khi MVP duoc validate.

**Visual can dung:**

- Cost/value chart: "Do ngay" vs "Defer".
- 2 cot: MVP value / Deferred cost.

**Speaker note:** Noi theo goc nhin kinh te: chi phi thoi gian cua nhom 7 SV duoc tap trung vao vong doi KTX cot loi.

**Nguon:** `product-backlog.md`, `product-roadmap.md`, `release-plan-fixed-date.md`.

---

---

## Slide 10 - Kha Thi Phap Ly Va Quy Trinh

**Nguoi noi:** TV2  
**Phan:** 1  
**Thong diep:** Du lieu sinh vien duoc doi xu nhu du lieu nhay cam: consent, RBAC, audit, khong export rong trong MVP.

**Noi dung tren slide:**

- US-002: sinh vien phai dong y xu ly du lieu truoc khi nop ho so.
- RBAC: Student, Staff, Admin co pham vi rieng.
- Negative tests: sinh vien truy cap staff/admin bi chan.
- Sensitive actions bat buoc ly do: duyet, reject, override, khoa phong, khoa user.
- Can hardening: tat `DEV_AUTH_BYPASS` truoc pilot that.

**Visual can dung:**

- Compliance checklist.
- Lock icon cho RBAC, file-check cho consent, audit icon cho log.

**Speaker note:** Dung tu "phap ly/quy trinh" thay vi noi qua sau ve luat; trong khuon kho mon hoc, minh chung la consent + RBAC + audit + khong dua secret/service key vao repo.

**Nguon:** `definition-of-done.md`, `risk-management.md`, `demo-script-test-scenarios.md`.

---

---

## Slide 11 - Core Feature Map

**Nguoi noi:** TV2  
**Phan:** 1  
**Thong diep:** Core features bao phu tron vong doi van hanh KTX.

**Noi dung tren slide:**

1. Login / RBAC / Consent.
2. Student application.
3. Application status.
4. Staff review.
5. Room/bed ledger.
6. Assignment suggestion + override reason.
7. Check-in / check-out.
8. Maintenance ticket + SLA board + reopen.
9. Operations dashboard.
10. Admin RBAC, room/rule config, reports/audit.

**Visual can dung:**

- Module map 3 cum: Student Portal, Staff Operations, Admin Governance.
- O giua la "DormCare Hub data layer".

**Speaker note:** Nhac "core" khong bao gom payment/SIS/native mobile. Neu slide qua day, chia module thanh 3 vung mau.

**Nguon:** `product-backlog.md`, `prototype-spec.md`.

---

---

## Slide 12 - Hai Luong Demo-Critical

**Nguoi noi:** TV2  
**Phan:** 1  
**Thong diep:** MVP duoc bao ve quanh 2 luong bat buoc demo duoc end-to-end.

**Noi dung tren slide:**

| Luong | User stories | Gia tri demo |
| --- | --- | --- |
| Ho so KTX | US-001 -> US-010 | SV nop, staff duyet, phan phong, check-in/out |
| Sua chua + Dashboard | US-011 -> US-014 | SV tao ticket, staff xu ly SLA, dashboard thay tinh hinh |

**Visual can dung:**

- Dual flowchart.
- Luong A mau teal, luong B mau blue.

**Speaker note:** Day la "xương sống" cua demo. Moi thay doi scope deu phai bao ve 2 luong nay truoc.

**Nguon:** `product-backlog.md`, `release-plan-fixed-date.md`.

---

---

## Slide 13 - Business Plan / Mo Hinh Tao Gia Tri

**Nguoi noi:** TV2  
**Phan:** 1  
**Thong diep:** Du an tao gia tri bang cach bien du lieu van hanh thanh quy trinh va quyet dinh nhanh hon.

**Noi dung tren slide:**

- Khach hang muc tieu: ban quan ly KTX, CTSV, campus co nhieu phong/giuong.
- Gia tri truc tiep: giam doi soat thu cong, giam sai ledger, tang minh bach cho SV.
- Gia tri quan tri: audit, dashboard, rui ro overdue/occupancy duoc thay som.
- Mo hinh rollout: MVP demo -> UAT noi bo -> pilot tung KTX -> Phase 2 readiness.
- Nguyen tac: khong ban du lieu, khong them SIS/payment neu chua phe duyet.

**Visual can dung:**

- Value chain: Correct data -> Clear workflow -> Faster decision -> Pilot readiness.

**Speaker note:** Noi day la business plan theo goc tao gia tri/van hanh, khong phai startup revenue model. San pham phuc vu to chuc nha truong.

**Nguon:** `project-overview.md`, `product-roadmap.md`.

---

---

## Slide 14 - Backlog Theo Ly Thuyet MoSCoW

**Nguoi noi:** TV3  
**Phan:** 1 + ly thuyet PM  
**Thong diep:** Backlog duoc uu tien bang MoSCoW va story point, khong lam tran lan.

**Noi dung tren slide:**

| Classification | Count | SP | Y nghia |
| --- | ---: | ---: | --- |
| Must | 13 | 74 | Bat buoc cho MVP |
| Should | 7 | 38 | Phase 2/pilot readiness |
| Could | 1 | 5 | Nice-to-have |
| Won't | 3 | 0 | Deferred |

**Visual can dung:**

- Donut/stacked bar MoSCoW.
- Highlight 13 Must.

**Speaker note:** Gan ly thuyet: MoSCoW giup co che cat scope trong fixed-date plan. Khong dong nghia toan bo 117 SP phai vao MVP.

**Nguon:** `product-backlog.md`.

---

---

## Slide 15 - Uoc Luong Du An Theo 2 Phuong Phap

**Nguoi noi:** TV3  
**Phan:** Ly thuyet PM  
**Thong diep:** Nhom uoc luong bang 2 phuong phap doc lap, ket qua hoi tu duoi 10%.

**Noi dung tren slide:**

| | Phuong phap 1 - Story Point | Phuong phap 2 - Three-point PERT |
| --- | --- | --- |
| Cach lam | Relative sizing Fibonacci, baseline 3 SP | E = (O + 4M + P) / 6 theo epic |
| Don vi | Story point + velocity 18.5 SP/sprint | Ngay-nguoi |
| Ket qua MVP | 74 SP / 18.5 = **8 tuan** | ~60 ngay-nguoi = **7.5-8.5 tuan** |

- Do lech giua 2 phuong phap: **< 10%** -> cung co do tin cay.
- Du co so cam ket fixed date 05-08-2026.

**Visual can dung:**

- 2 cot so sanh PP1 / PP2.
- Thanh do "8 tuan" vs "7.5-8.5 tuan" gan nhau, highlight "lech < 10%".

**Speaker note:** Nhan manh: uoc luong khong phai con so tuyet doi; 2 phuong phap hoi tu la bang chung ke hoach kha thi. Story point = effort/complexity/risk, khong quy cung ra gio.

**Nguon:** `high-level-estimate.md`.

---

## Slide 16 - Release Strategy: Fixed-Date

**Nguoi noi:** TV3  
**Phan:** Ly thuyet PM  
**Thong diep:** Nhom chon fixed-date: giu ngay 05-08-2026, linh hoat scope ngoai Must-have.

**Noi dung tren slide:**

| Sprint | Dates | Planned SP | Goal |
| --- | --- | ---: | --- |
| S1 | 10/06 -> 24/06 | 29 | RBAC, consent, application, ledger |
| S2 | 24/06 -> 08/07 | 21 | Review, assignment, override, check-in/out |
| S3 | 08/07 -> 22/07 | 16 | Maintenance/SLA/reopen |
| S4 | 22/07 -> 05/08 | 8 | Dashboard, stabilization |

**Visual can dung:**

- Sprint timeline 4 moc.
- Badge "Fixed date: 05-08-2026".

**Speaker note:** Noi ro ly thuyet D07: fixed-date giu ngay phat hanh, khong them nguoi giua release, neu cham thi cat might-have truoc.

**Nguon:** `release-plan-fixed-date.md`.

---

---

## Slide 17 - Dinh Nghia Quy Trinh Phan Mem

**Nguoi noi:** TV3  
**Phan:** Ly thuyet PM  
**Thong diep:** Nhom chay Scrum sprint 2 tuan voi 7 trang thai cong viec ro rang.

**Noi dung tren slide:**

- Khung: Scrum, sprint 2 tuan, 4 sprint MVP.
- Pipeline 7 trang thai: Backlog -> Ready -> In Progress -> Review -> QA Testing -> Done -> Released.
- Ceremonies: sprint planning, daily, sprint review, retro.
- RACI phan trach nhiem 9 vai tro (PM, BA, TL, BE, FE, QA, UX, USR, Sponsor).

**Visual can dung:**

- Pipeline ngang 7 chip noi mui ten (2 chip cuoi to mau teal = Done/Released).
- Icon vong lap sprint 2 tuan.

**Speaker note:** Noi quy trinh la co che dam bao chat luong: mot story phai di het pipeline, khong nhay tu In Progress thang len Done.

**Nguon:** `Dinh nghia quy trinh phan mem.docx`, `definition-of-done.md`.

---

## Slide 18 - Definition of Done

**Nguoi noi:** TV3  
**Phan:** Ly thuyet PM  
**Thong diep:** "Xong" khong phai co UI; xong la co evidence.

**Noi dung tren slide:**

- Requirement ro.
- Scope dung MVP.
- UI/UX theo prototype.
- PR/CI/build pass.
- Test + QA.
- RBAC negative.
- Sample data tai hien flow.
- Docs/update traceability.
- Demo duoc trong Sprint Review.

**Visual can dung:**

- Checklist 9-11 muc.
- Box canh bao: `Not Done = UI co nhung khong demo duoc / RBAC fail / dashboard khong action`.

**Speaker note:** Lay vi du: staff override ma khong bat ly do thi chua Done, dashboard chi co chart trang tri thi chua Done.

**Nguon:** `definition-of-done.md`.

---

---

## Slide 19 - Proof of Concept

**Nguoi noi:** TV3  
**Phan:** Ly thuyet + evidence  
**Thong diep:** PoC tap trung vao cac gia thuyet rui ro nhat truoc khi build rong.

**Noi dung tren slide:**

| Gia thuyet | Nguong pass |
| --- | --- |
| Rule engine goi y phong huu ich | >= 80% acceptable |
| Moi suggestion giai thich duoc | 100% co reason |
| QR context dung | >= 95% mapping |
| SLA state dung | 100% tickets |
| KPI lay tu cung data | 100% selected KPI |

**Visual can dung:**

- Hypothesis table H1-H5.
- Icon target/check.

**Speaker note:** Noi PoC khong phai tai lieu cho co; no giup nhom bat loi thiet ke som, dac biet voi phan phong va SLA.

**Nguon:** `proof-of-concept.md`.

---

---

## Slide 20 - PoC Result: Fail That -> Fix That

**Nguoi noi:** TV3  
**Phan:** Evidence  
**Thong diep:** PoC pass, va co gia tri vi bat duoc bug that TC-03.

**Noi dung tren slide:**

- TC-01, TC-02, TC-04 -> TC-09: PASS.
- TC-03 lan dau FAIL: engine tung goi y bed da co nguoi.
- Nguyen nhan: so sanh ma bed thieu chuan hoa prefix.
- Fix: occupancy check chuan hoa ma bed.
- Retest: PASS.

**Visual can dung:**

- Test result grid 9 TC.
- Highlight TC-03 bang mau amber: `FAIL -> FIXED -> PASS`.

**Speaker note:** Diem nay rat tot khi bi hoi "test co y nghia khong?". Tra loi: co, vi test bat loi ma mock demo co the khong thay.

**Nguon:** `proof-of-concept.md`, `risk-management.md`.

---

---

## Slide 21 - First Release Da Du Dung Chua?

**Nguoi noi:** TV3  
**Phan:** Demo readiness  
**Thong diep:** Du xai cho first release/demo mon hoc; chua goi la production-ready cho pilot that.

**Noi dung tren slide:**

| Da du dung | Chua day du / can hardening |
| --- | --- |
| 13/13 Must story demo duoc | JWT auth that chua bat |
| 2 luong critical chay that | Coverage 70% chua do theo module |
| Azure + Supabase + E2E pass | QR camera/import/export chua co |
| RBAC negative pass | Azure free tier co cold start |

**Visual can dung:**

- Ready/not-ready split.
- Ben trai xanh "First release đủ xài"; ben phai vang "Hardening before pilot".

**Speaker note:** Cau noi chot: "Nhom khong noi day la production-ready; nhom noi no du xai cho first release va chung minh core value."

**Nguon:** `progress-report-week10.md`, `demo-script-test-scenarios.md`.

---

---

## Slide 22 - So Do To Chuc Nhom

**Nguoi noi:** TV4  
**Phan:** 2 - Quan ly nhan su  
**Thong diep:** Nhom 7 nguoi chia theo ownership de lam song song, giam conflict.

**Noi dung tren slide:**

- Member 1: shell, shared UI, repositories, docs.
- Member 2: auth, login, profile, consent, RBAC.
- Member 3: student dashboard, application, room.
- Member 4: student tickets, requests, invoices/notifications draft.
- Member 5: staff dashboard, applications, allocation, check-in/out.
- Member 6: residents, maintenance, billing/tasks draft.
- Member 7: admin dashboard, users/RBAC, rooms/rules, audit/settings.

**Visual can dung:**

- Org chart phang.
- 7 lanes theo member.

**Speaker note:** Noi folder ownership la co che quan ly nhan su trong code, khong chi phan cong tren giay.

**Nguon:** `TEAM_ASSIGNMENT.md`, `AGENTS.md`.

---

---

## Slide 23 - Vai Tro Theo RACI

**Nguoi noi:** TV4  
**Phan:** 2  
**Thong diep:** Moi nguoi co vai tro trinh bay va vai tro thuc thi ro.

**Noi dung tren slide:**

| Vai | Trach nhiem |
| --- | --- |
| PM / Scrum Master | Ke hoach sprint, scope, risk |
| BA / PO | Backlog, acceptance criteria |
| Tech Lead | Architecture, API, data boundary |
| UI/UX | Prototype, screen flow |
| Developer | Implement feature theo ownership |
| QA / Risk | Test, negative cases, risk register |
| Demo Owner | Script, seed data, live/video backup |

**Visual can dung:**

- RACI mini matrix.
- Cot `Responsible`, `Accountable`, `Consulted`, `Informed`.

**Speaker note:** Khong can gan ten that neu nhom chua muon dua ten len; co the thay TV1-TV7.

**Nguon:** `project-overview.md`, `project-documentation-review.md`.

---

---

## Slide 24 - Tracking Member 1-2

**Nguoi noi:** TV4  
**Phan:** 2  
**Thong diep:** Nen tang va auth da du de cac feature member lam song song.

**Noi dung tren slide:**

| Member | Ket qua hien tai | Viec con lai |
| --- | --- | --- |
| M1 | App shell, routes, shared UI, API layer, docs sync, mock/live data mode | Hardening docs/evidence |
| M2 | Login, role gate, consent, profile/RBAC UI | JWT auth that sau demo |

**Visual can dung:**

- Owner lane 2 cot.
- Badge `Done`, `Hardening`.

**Speaker note:** Nhac day la nen tang tranh viec screen goi fetch truc tiep hoac moi nguoi tu tao UI primitive rieng.

**Nguon:** `TEAM_ASSIGNMENT.md`, `implementation-traceability.md`.

---

---

## Slide 25 - Tracking Member 3-4

**Nguoi noi:** TV4  
**Phan:** 2  
**Thong diep:** Student portal da bao phu ca ho so, phong hien tai va dich vu ticket.

**Noi dung tren slide:**

| Member | Ket qua hien tai | Viec con lai |
| --- | --- | --- |
| M3 | Student dashboard, application form/status, current room | Polish responsive/mobile states |
| M4 | Student tickets, create/detail, confirm/reopen, requests/invoices/notifications draft | Phase 2 items khong block MVP |

**Visual can dung:**

- Owner lane 2 cot.
- Mini flow: application -> room -> ticket.

**Speaker note:** Noi ro invoices/notifications co the xuat hien draft nhung khong tinh la release blocker cua MVP.

**Nguon:** `TEAM_ASSIGNMENT.md`, `implementation-traceability.md`.

---

---

## Slide 26 - Tracking Member 5-6

**Nguoi noi:** TV4  
**Phan:** 2  
**Thong diep:** Staff operations da bao phu review, allocation, check-in/out va SLA.

**Noi dung tren slide:**

| Member | Ket qua hien tai | Viec con lai |
| --- | --- | --- |
| M5 | Staff dashboard, review queue, assignment suggestion/override, check-in/out | UAT voi staff that |
| M6 | Residents, maintenance/SLA board, billing/tasks draft | SLA edge cases, Phase 2 billing/tasks |

**Visual can dung:**

- Swimlane Staff Ops A/B.
- Icons: clipboard-check, bed, wrench, users.

**Speaker note:** Nhan manh staff flow la noi the hien "khong chi CRUD": state guard, reason required, SLA due time.

**Nguon:** `TEAM_ASSIGNMENT.md`, `demo-script-test-scenarios.md`.

---

---

## Slide 27 - Tracking Member 7 Va Tong Hop

**Nguoi noi:** TV4  
**Phan:** 2  
**Thong diep:** Admin governance va tracking tong the giup chung minh tat ca Must-have da demo duoc.

**Noi dung tren slide:**

| Member | Ket qua hien tai | Viec con lai |
| --- | --- | --- |
| M7 | Admin dashboard, RBAC/users, buildings/rooms, allocation rules, audit/settings | Audit export Phase 2 |

**Tracking tong:**

- 13/13 Must story co man hinh.
- UI co mock/live mode.
- Backend API da wired.
- Known gaps duoc ghi nhan, khong giau.

**Visual can dung:**

- Tracking board 7 member.
- Cot `Done`, `Hardening`, `Phase 2`.

**Speaker note:** Ket phan nhan su bang y: chia ownership ro giup group lam song song, tranh conflict, co nguoi chiu trach nhiem tung mien.

**Nguon:** `TEAM_ASSIGNMENT.md`, `progress-report-week10.md`.

---

---

## Slide 28 - Tien Do Tong The

**Nguoi noi:** TV5  
**Phan:** 3 - Tien do va van hanh  
**Thong diep:** Du an dang som hon ke hoach khoang 1.5 sprint o pham vi Must-have.

**Noi dung tren slide:**

- Ke hoach: 4 sprint x 2 tuan, release fixed-date 05-08-2026.
- Sprint 1: dung ke hoach, con 45 SP.
- Het Sprint 2: Must-have ve 0 SP.
- S3-S4: chuyen thanh hardening, UAT, pilot readiness.
- First release co tu 05-07, du 2 luong critical.

**Visual can dung:**

- Chen `docs/pm/assets/burndown-chart.svg`.
- Neu lam lai chart: plan line xam, actual line teal.

**Speaker note:** Giai thich ngan: S1 dung plan, S2 tang toc vi backend/frontend song song va AI-assisted development.

**Nguon:** `progress-report-week10.md`, `assets/burndown-chart.svg`.

---

---

## Slide 29 - Velocity

**Nguoi noi:** TV5  
**Phan:** 3  
**Thong diep:** Velocity cao la su that co bang chung, nhung khong nen lay lam baseline Phase 2.

**Noi dung tren slide:**

| Sprint | Planned | Actual | Ghi chu |
| --- | ---: | ---: | --- |
| S1 | 29 SP | 29 SP | Dung ke hoach |
| S2 | 21 SP | 45 SP | Keo som S3-S4 + backend integration |
| Baseline | 18.5 SP/sprint | Khong doi | Phase 2 van dung baseline cu |

**Visual can dung:**

- Chen `docs/pm/assets/velocity-chart.svg`.
- Box warning: `Do not use 37 SP/sprint as future commitment`.

**Speaker note:** Noi trung thuc: velocity dot bien vi AI-assisted dev va song song backend/frontend; PM khong nen bien no thanh cam ket cho lan sau.

**Nguon:** `progress-report-week10.md`, `assets/velocity-chart.svg`.

---

---

## Slide 30 - Dieu Chinh Backlog

**Nguoi noi:** TV5  
**Phan:** 3  
**Thong diep:** Nhom dieu chinh bang cach keo Must-have len som, khong cat luong critical.

**Noi dung tren slide:**

| Sprint | Ke hoach goc | Dieu chinh thuc te |
| --- | --- | --- |
| S1 | US-001, 002, 003, 004, 006 | Giu nguyen |
| S2 | US-005, 008, 009, 010 | + keo US-011, 012, 013, 014 |
| S3 | Maintenance/SLA | Hardening, QR UI, KPI drilldown, UAT |
| S4 | Dashboard | Stabilize, demo package, release buffer |

**Visual can dung:**

- Sprint adjustment table.
- Arrow keo US-011->014 tu S3/S4 ve S2.

**Speaker note:** Day la agile adaptation hop ly vi keo Must-have som; diem chua OK la mot so Phase 2/deferred bi lot vao, se noi slide 29.

**Nguon:** `progress-report-week10.md`.

---

---

## Slide 31 - Van Hanh Da OK

**Nguoi noi:** TV5  
**Phan:** 3  
**Thong diep:** Core MVP van hanh tot vi co evidence tu PoC, test, traceability va demo data.

**Noi dung tren slide:**

- PoC bat duoc bug TC-03 va da fix.
- RBAC negative cases pass.
- Traceability story -> UI -> API -> test.
- Dashboard KPI co danh sach/action.
- Audit-first cho thao tac nhay cam.
- 2 luong critical demo end-to-end.

**Visual can dung:**

- Evidence wall: PoC, E2E, UI-flow, DB persist, audit.
- 6 card tick xanh.

**Speaker note:** Neu thay hoi "Ke hoach van hanh OK chua?", tra loi: core OK, nhung nhom co danh sach chua OK ro rang.

**Nguon:** `implementation-traceability.md`, `demo-script-test-scenarios.md`.

---

---

## Slide 32 - Nhung Viec Chua OK

**Nguoi noi:** TV5  
**Phan:** 3  
**Thong diep:** Nhom chu dong bao cao diem chua OK thay vi lam dep so lieu.

**Noi dung tren slide:**

| Van de | Tac dong | Trang thai |
| --- | --- | --- |
| MoMo/notification vao som | Scope creep, vi pham release gate | Can change log hoi to |
| `DEV_AUTH_BYPASS` tren public demo | Rui ro mao danh | Chap nhan tam, phai tat truoc pilot |
| Coverage 70% chua do | DoD chua du evidence | Can them coverage report |
| Azure free tier cold start | Demo co the tre 30-60s | Can warmup `/health` |

**Visual can dung:**

- Warning cards 4 o mau amber/red.
- Icon alert triangle.

**Speaker note:** Giu gioi han: cac van de nay khong chan first release demo, nhung chan viec goi san pham la pilot/production-ready.

**Nguon:** `progress-report-week10.md`, `risk-management.md`.

---

---

## Slide 33 - Giai Phap De Xuat

**Nguoi noi:** TV5  
**Phan:** 3  
**Thong diep:** S3-S4 nen dung cho hardening va pilot readiness, khong them scope thua.

**Noi dung tren slide:**

| Van de | Giai phap | Han muc tieu |
| --- | --- | --- |
| Scope creep | Change log hoi to, label beyond-MVP | 15-07 |
| Dev bypass | JWT auth that, tat bypass truoc pilot | 18-07 |
| Coverage | Them vitest/c8, report module coverage | 22-07 |
| Cold start | Mo `/health`, chuan bi video fallback | Truoc demo |
| UAT it | Moi 1-2 staff thu flow ho so/ticket | S3-S4 |

**Visual can dung:**

- Action plan table.
- Cot status: Now / Next / Before pilot.

**Speaker note:** Chot phan tien do: project som hon ke hoach, nen buffer phai dung de lam chac, khong phai them tinh nang ngoai MVP.

**Nguon:** `progress-report-week10.md`.

---

---

## Slide 34 - Ly Thuyet Quan Tri Rui Ro

**Nguoi noi:** TV6  
**Phan:** 4 - Quan tri rui ro  
**Thong diep:** Rui ro duoc do bang xac suat va tac dong, khong chi liet ke cam tinh.

**Noi dung tren slide:**

- Cong thuc: `Risk Exposure = Probability x Impact`.
- Impact duoc quy ve story point / muc do anh huong release.
- Moi risk can co: trigger, response, owner, contingency.
- Risk register phai cap nhat theo thuc te, ke ca risk da xay ra.

**Visual can dung:**

- Risk formula lon giua slide.
- Heatmap Probability x Impact.

**Speaker note:** Noi day la cach nhom bam ly thuyet D08 Software Risk Management.

**Nguon:** `risk-management.md`.

---

---

## Slide 35 - Risk Register Top

**Nguoi noi:** TV6  
**Phan:** 4  
**Thong diep:** Cac risk lon nhat da duoc ghi nhan va co mitigation.

**Noi dung tren slide:**

| ID | Risk | RE / Trang thai | Response |
| --- | --- | --- | --- |
| R-03 | Velocity thap / Sprint 1 qua tai | Dong theo chieu nguoc | Khong dung velocity dot bien lam baseline |
| R-10 | Phase 2 leak | Da xay ra | Change gate, not release-blocking |
| R-01 | Data ban/thieu | Mitigated | Seed dataset + validation |
| R-13 | Dev auth bypass public | Dang ton tai | Tat truoc pilot |
| R-15 | AI velocity khong ben | Theo doi | Baseline Phase 2 = 18.5 |

**Visual can dung:**

- Top risk table.
- Badge Critical/High/Medium.

**Speaker note:** Diem hay la risk register co "actuals": cai nao da xay ra thi noi da xay ra, khong sua cho dep.

**Nguon:** `risk-management.md`.

---

---

## Slide 36 - Huong A: Giu Mock Den Cuoi MVP

**Nguoi noi:** TV6  
**Phan:** 4  
**Thong diep:** Huong A it doi ha tang ban dau, nhung day rui ro integration ve cuoi ky.

**Noi dung tren slide:**

**Huong A:** frontend mock den het MVP, noi backend sau release.

| Rui ro | Tac dong |
| --- | --- |
| Big-bang integration cuoi ky | Doi enum/API/bed code don vao Sprint 4 |
| Demo bi chat van "khong that" | Giam do tin cay khi bao ve |
| Bug DB lo muon | Loi SQL/ledger chi thay khi chay data that |
| Backend/frontend lam roi | Ton thoi gian dong bo muon |

**Visual can dung:**

- A-side risk matrix.
- Timeline co vung do lon o cuoi Sprint 4.

**Speaker note:** Noi ro day la ke hoach goc co ve an toan hon luc dau, nhung khi project gap lech contract that thi rui ro tro nen lon.

**Nguon:** `risk-management.md`.

---

---

## Slide 37 - Huong B: Tich Hop Backend/Azure Som

**Nguoi noi:** TV6  
**Phan:** 4  
**Thong diep:** Huong B tra rui ro som, doi lai phai chap nhan hardening ve bao mat/scope.

**Noi dung tren slide:**

**Huong B:** tich hop backend, deploy Azure, chay Supabase som.

| Rui ro | Thuc te / phong ngua |
| --- | --- |
| Scope creep | MoMo/notification vao som -> change log |
| Dev bypass public | R-13 -> tat truoc pilot |
| Infra dependency | Warmup `/health`, video fallback |
| Mat thoi gian polish UI | S3-S4 chuyen hardening |

**Visual can dung:**

- B-side risk matrix.
- Ben phai co "risk paid early".

**Speaker note:** Noi trung thuc: B khong hoan hao, nhung no lam ro bug that va giam nguy co vo tran cuoi ky.

**Nguon:** `risk-management.md`, `progress-report-week10.md`.

---

---

## Slide 38 - Quyet Dinh: Chon Huong B

**Nguoi noi:** TV6  
**Phan:** 4  
**Thong diep:** Nhom chon B vi no giam R-11, bat bug som va tao ban release chay that.

**Noi dung tren slide:**

| Duoc | Mat / can quan ly |
| --- | --- |
| Bat 2 bug backend som | R-10 scope creep |
| Mapper giup dong bo contract | R-13 dev bypass |
| Demo chay that tren DB/API | Phu thuoc Azure/Supabase |
| PoC thuc thi bang he thong that | Can hardening S3-S4 |

**Visual can dung:**

- Decision balance scale.
- Mui ten chon B.

**Speaker note:** Cau chot: "Nhom chap nhan risk B co kiem soat, thay vi de integration risk no vao Sprint 4."

**Nguon:** `risk-management.md`.

---

---

## Slide 39 - Phong Ngua Tiep Theo

**Nguoi noi:** TV6  
**Phan:** 4  
**Thong diep:** Risk khong ket thuc sau khi chon huong; phai co mitigation den release.

**Noi dung tren slide:**

- Gate Phase 2: item ngoai MVP phai qua PM.
- Tat `DEV_AUTH_BYPASS`, phat hanh JWT auth that.
- Do coverage module auth/RBAC, assignment, SLA, admin.
- UAT voi 1-2 staff that.
- Warmup Azure va co video fallback.
- Khong dung velocity dot bien lam cam ket Phase 2.

**Visual can dung:**

- Mitigation roadmap tu 07-07 den 05-08.
- Checklist risk controls.

**Speaker note:** Chuyen tiep sang storyboard: risk duoc quan tri de bao ve cac luong trai nghiem nguoi dung sau day.

**Nguon:** `risk-management.md`, `progress-report-week10.md`.

---

---

## Slide 40 - Storyboard Tong Quan

**Nguoi noi:** TV7  
**Phan:** 4 - Storyboard  
**Thong diep:** Mot ho so/ticket di qua nhieu vai tro, moi buoc co guard, reason va audit.

**Noi dung tren slide:**

1. Student login va consent.
2. Student tao ho so.
3. Staff review.
4. Staff chay suggestion.
5. Staff confirm/override.
6. Student xac nhan giuong.
7. Staff check-in.
8. Student tao maintenance ticket.
9. Staff/maintenance xu ly SLA.
10. Student confirm/reopen.
11. Admin quan tri rule/audit.

**Visual can dung:**

- 9-11 frame storyboard.
- Moi frame co role icon va UI thumbnail.

**Speaker note:** Nhan manh co 3 portal rieng: Student, Staff, Admin; day la mot luong lien thong chu khong phai man hinh tach roi.

**Nguon:** `prototype-spec.md`, `demo-script-test-scenarios.md`.

---

---

## Slide 41 - Story 1: Student Application State Machine

**Nguoi noi:** TV7  
**Phan:** Storyboard  
**Thong diep:** Ho so KTX la state machine co guard, khong phai update field tuy y.

**Noi dung tren slide:**

State flow:

`draft -> submitted -> approved/rejected -> suggested -> waiting_checkin -> checked_in -> checked_out`

Guards:

- Chua consent thi khong vao form.
- Thieu minh chung thi khong submit.
- Staff duyet/reject phai co ly do.
- SV phai xac nhan giuong truoc check-in.

**Visual can dung:**

- State machine ngang.
- Guard icons tren cac transition.

**Speaker note:** Day la noi de tra loi "khong chi CRUD": backend chan nhay coc trang thai, UI chi hien action hop le.

**Nguon:** `demo-script-test-scenarios.md`, `implementation-traceability.md`.

---

---

## Slide 42 - Story 2: Staff Review -> Assignment -> Check-in

**Nguoi noi:** TV7  
**Phan:** Storyboard  
**Thong diep:** Staff khong chi chon phong; he thong de xuat, giai thich, va bat ly do khi override.

**Noi dung tren slide:**

- Staff mo review queue.
- Xem ho so, evidence, priority.
- Duyet co ly do.
- Chay assignment suggestion.
- Xem recommended bed, reason codes, disqualified options.
- Confirm hoac override voi reason.
- Check-in voi checklist ban giao.

**Visual can dung:**

- Swimlane Student/Staff.
- Chen 3 screenshot/vung UI: review queue, suggestion reason panel, check-in checklist.

**Speaker note:** Nhan manh rule reasons: gender match, capacity, cohort/department, not maintenance hold.

**Nguon:** `prototype-spec.md`, `demo-script-test-scenarios.md`.

---

---

## Slide 43 - Story 3: Maintenance Ticket Va SLA

**Nguoi noi:** TV7  
**Phan:** Storyboard  
**Thong diep:** Ticket co SLA runtime va reopen loop, tranh viec staff tu dong dong ticket sai.

**Noi dung tren slide:**

Ticket lifecycle:

`new -> assigned -> in_progress -> waiting_confirm -> reopened -> completed/closed`

Key rules:

- Student mo ticket gan room/asset.
- Priority tao SLA due time.
- Staff/maintenance resolve xong thi cho SV xac nhan.
- SV co the reopen neu chua dat.
- Overdue tinh theo thoi gian runtime.

**Visual can dung:**

- Ticket lifecycle diagram.
- Mau do/cam cho overdue, xanh cho completed.

**Speaker note:** Noi "SLA khong phai flag nhap tay"; he thong tinh dua vao priority, assignment time, due time.

**Nguon:** `proof-of-concept.md`, `demo-script-test-scenarios.md`.

---

---

## Slide 44 - Story 4: Admin Governance

**Nguoi noi:** TV7  
**Phan:** Storyboard  
**Thong diep:** Admin config anh huong truc tiep nghiep vu va moi thao tac nhay cam co audit.

**Noi dung tren slide:**

- Admin khoa phong bao tri, bat buoc nhap ly do.
- Staff chay suggestion: phong bi khoa bien mat khoi goi y.
- Admin quan ly allocation rules: rule bat buoc khong duoc tat tuy y.
- Admin khoa user/RBAC: user bi chan theo role/status.
- Audit log ghi actor, action, timestamp, reason.

**Visual can dung:**

- Diagram: Admin config -> Rule engine -> Staff suggestion result -> Audit log.
- 4 node co mui ten tac dong.

**Speaker note:** Day la diem governance: admin khong chi la CRUD config; config doi ket qua nghiep vu that.

**Nguon:** `demo-script-test-scenarios.md`, `risk-management.md`.

---

---

## Slide 45 - Demo Run Va Q&A

**Nguoi noi:** TV7  
**Phan:** Demo + ket  
**Thong diep:** Demo du 3 hoi de chung minh core value va tra loi "he thong da du xai chua".

**Noi dung tren slide:**

| Demo | Thoi luong | Diem nhan |
| --- | ---: | --- |
| Ho so KTX | 7 phut | Consent, validation, review, suggestion, check-in |
| Maintenance SLA | 5 phut | Priority -> due time, resolve, reopen |
| Admin governance | 5 phut | Khoa phong/rule/RBAC, audit |

Tai khoan demo:

- `student@edu.vn` / `123456`
- `staff@edu.vn` / `123456`
- `admin@edu.vn` / `123456`

**Visual can dung:**

- Demo checklist.
- QR/link repo/deploy neu co.
- 6 badge "not just CRUD": state machine, rule engine, SLA runtime, RBAC server-side, audit-first, real infra.

**Speaker note:** Ket bang cau: "San pham da du dung de first release va bao ve gia tri cot loi; giai doan tiep theo khong them scope thua, ma hardening de san sang pilot."

**Nguon:** `demo-script-test-scenarios.md`, `progress-report-week10.md`.

---

---

## Ban Do Slide Theo Yeu Cau Cua Thay

| Yeu cau cua thay | Slide |
| --- | --- |
| Product la gi, giai quyet bai toan gi | 03-05 |
| Doi chieu feasibility | 06-09 |
| Core features | 10-11 |
| Business plan / mo hinh tao gia tri | 12 |
| So do to chuc nhom | 19-20 |
| Tracking cong viec thanh vien | 21-24 |
| Tien do tong the | 25-27 |
| Van hanh OK/chua OK | 28-29 |
| Giai phap cham/kho | 30 |
| Risk A/B | 31-36 |
| Storyboard | 37-41 |
| Demo du xai chua | 18, 42 |

## Danh Sach Visual Can Phan Cong

| Visual | Slide | Nguoi nen phu trach |
| --- | --- | --- |
| Dashboard mockup / cover | 01 | TV1 |
| Before/after Excel-Zalo-paper -> app | 03 | TV1 |
| Pain point map | 04 | TV1 |
| Feasibility quadrant | 06 | TV1/TV2 |
| Architecture light | 07 | TV2 |
| Core feature module map | 10 | TV2 |
| Dual demo-critical flow | 11 | TV2 |
| MoSCoW chart | 13 | TV3 |
| Fixed-date sprint timeline | 14 | TV3 |
| DoD checklist | 15 | TV3 |
| PoC test grid | 17 | TV3 |
| Org chart + RACI | 19-20 | TV4 |
| Member tracking board | 21-24 | TV4 |
| Burndown chart | 25 | TV5 |
| Velocity chart | 26 | TV5 |
| Warning/action cards | 29-30 | TV5 |
| Risk heatmap + A/B matrices | 31-35 | TV6 |
| Mitigation roadmap | 36 | TV6 |
| Storyboard frames | 37-41 | TV7 |
| Demo checklist | 42 | TV7 |

## Q&A Backup Points

| Cau hoi co the gap | Cau tra loi ngan |
| --- | --- |
| Product da dung feasibility chua? | Co: ky thuat, kinh te, van hanh dung huong; phap ly/quy trinh co consent/RBAC/audit nhung can tat dev bypass truoc pilot. |
| He thong co phai chi CRUD? | Khong: co state machine, rule engine explainable, SLA runtime, RBAC server-side, audit-first, real DB/API. |
| Sao velocity cao bat thuong? | Do AI-assisted dev + backend/frontend song song + PoC ro; nhom khong dung 37 SP/sprint lam baseline Phase 2. |
| Chua OK la gi? | Scope creep MoMo/notification, dev bypass public, coverage chua do, Azure cold start. |
| Tai sao chon tich hop backend som? | De tra rui ro integration som, bat bug DB/suggestion som, co demo that; chap nhan hardening R-10/R-13. |
| First release da du xai chua? | Du xai cho demo mon hoc va core flow; chua production-ready cho pilot that neu chua hardening auth/coverage/UAT. |
