# USA CASE — lach USA, b chno w b ch7al (dossier dyal l marché)

Status: draft v1. Had l document owner-facing (b Darija, technical terms b English). L arqam li fih ghalban **taqdirat subjective dyal l architect**, machi data mqisa, ila ma t9al l'3aks. Sources f lkhir.

---

## 1. L khtiar w l qrar

**Qrar**: nbdaw b **USA**, **federal jobs ghir**, b **USAJOBS API officielle**, site b English.

**Lach USA (l khtisar)**

1. **Ceiling aktar**: RPM bin USA, Canada w Australia 9rib mtsawi (±25%, mqiss b YouTube RPM ka proxy, machi RPM dyal websites), walakin l population f USA kbira b ~8-12x. L flous kayn f marché l kbir.
2. **Data nqiya w légale**: API officielle, bla scraping, bla ToS gray zone. Hada l'avantage l9awi dyalna 3la ay site kay-scrapi.
3. **Langue**: English. Ma7ajtch reviewer native (b3ks Germany).
4. **Architecture agnostic**: ila USA ma khdmatch, nbdlo l marché b adapter jdid (Canada/Australia) bla n3awdo kolchi.

**L mochkil l kbir f USA (khass n3tarfo bih)**: l federal hiring **m9ayd bzaf** daba (freeze w restrictions). Offers a9al mn 9bl, w competition 3la kol job kbira. Ya3ni "daily offers" wa7dha ma-kafyach ka value. L value dyalna khass tkoun **guides + plain English eligibility + alerts**.

## 2. Wach niche mzyana?

- Audience kayn: nas jdad f federal jobs w students, w nas li kherjo mn federal jobs f 2025.
- Data 3amma l kolchi; l moat machi data, howa **clarity w trust**.
- Competition: USAJOBS nafso + Indeed/LinkedIn/ZipRecruiter + Google for Jobs + sites mkhassssin f federal jobs. **Ma 3ndnach daba Gate D (SERP analysis) b data 7aya.**

## 3. Mqarana m3a marchés okhrin (kholasa)

| Marché             | Qrar           | Sbab                                                                                                                                                |
| ------------------ | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **USA**            | **Khtiar lwl** | Data légale, English, ceiling kbir                                                                                                                  |
| Germany            | Mo2ajjal       | German khass reviewer native; Impressum/Abmahnung; SERP mzdr3a b incumbents (public sector pay tables); data source gray; AdSense f EEA kay7taj CMP |
| Canada / Australia | Backup         | RPM 9rib, ceiling sghir (~10x a9al); data sources mazal ma t2ekedtch                                                                                |
| India / Maroc      | Machi l hadaf  | RPM dh3if bzaf (khdma b traffic kbir w flous 9lal)                                                                                                  |

## 4. L hadaf dyal flous: chno realiste

Hadaf dyal owner: AdSense y9bl l site f ~3 mois w ybda ydkhl flous; w "najah" = **$300-500+/chhar** f nhayt chhar 3.

**Taqdir subjective (solo, white-hat, domain jdid)**

| Hadaf                                               | f 3 mois | f 6 chhar | f 12 chhar |
| --------------------------------------------------- | -------- | --------- | ---------- |
| AdSense approved (ila content asli w policies s7a7) | ~75-85%  |           |            |
| Awl flous (cents/$)                                 | ~50-65%  |           |            |
| Wsol l $100 (7ad l payout, check Google help)       | ~15-25%  | ~40%      |            |
| $300-500/chhar mn ads                               | **< 5%** | ~15-20%   | ~30-40%    |

**Lach**: flous AdSense = **traffic × RPM**. B RPM taqdiri $8-20 l kol 1000 sessions:

| Sessions / chhar | Revenu ads taqdiri / chhar |
| ---------------- | -------------------------- |
| 10,000           | $80 - $200                 |
| 30,000           | $240 - $600                |
| 100,000          | $800 - $2,000              |

Ya3ni bach nwsslo l $300-500 khassna ~**15k-50k sessions/chhar**, w hadchi f 3 mois sa3b. Ma 3ndi 7ta data 7aya 3la RPM s7i7: howa ghadi ybayn mn AdSense dyalk (Countries report).

**Qrar mfto7 (khass owner yjwb)**: wach nkhdmo **A+B** (freelance/automation l cash sri3 + had l mchrou3 ka asset tawil) wla B wa7do? Ila "flous f 4 chhour" howa l hadaf l7a9i9i, mssar A khass ykon jouz2 mn l plan.

## 5. Khatar l kbar (w mitigation)

| Khatar                                     | Mitigation                                                                               |
| ------------------------------------------ | ---------------------------------------------------------------------------------------- |
| Federal hiring dh3if / volatile            | Gate B f Phase 1 (new jobs/day); guides w tools bach site ykon mfid 7ta mnin offers 9lal |
| AdSense "low value content"                | Job pages b original value (summary, eligibility, pay context); 15-30 pages 9bl apply    |
| SEO bti2 f domain jdid                     | Newsletter w communities (b rules dyalhom), long-tail guides                             |
| Eligibility ghalat                         | Deterministic mapping + source + disclaimer; no LLM f v1                                 |
| Competition m9wya                          | Gate D; differentiation 3la UX, clarity, alerts                                          |
| Free tiers w Vercel Hobby (non-commercial) | Plan dyal upgrade 9bl monetization; budget f `costs-and-limits.md`                       |

## 6. Chno khass n-t2ekdo (validation gates)

| Gate | Chno                                  | Status                                                           |
| ---- | ------------------------------------- | ---------------------------------------------------------------- |
| A    | Data légale (USAJOBS API officielle)  | **Mqboul mbdi2iyan** (khass 9raya dyal ToS f Phase 1)            |
| B    | Volume dyal offers (new/day)          | **Mazal** (n9isoh b API f Phase 1)                               |
| C    | Search demand dyal keywords           | **Mazal** (Semrush API units mkhlssin; wla Google Trends manual) |
| D    | SERP competition l long-tail keywords | **Mazal** (web research manual possible)                         |
| E    | RPM/CPC                               | **Mazal** (l9ima l7a9i9a mn AdSense mn ba3d)                     |

**Kill-switch**: ila B ban dh3if bzaf **w** D ban saturated bla angle, nchoufo Canada/Australia. Ma n9rrouch 3la ayhom bla data.

## 7. Operations mn Maroc (checklist, machi nasiha qanouniya)

- **Statut f Maroc**: khass comptable (auto-entrepreneur wla ghayro) ykhtar lik s7i7, w y-chrh taxes w réglementation dyal l devises.
- **Payment**: AdSense payout b virement l compte marocain; t2ekd mn banque mn SWIFT w devises. L payout threshold w l verification (address/PIN) t2ekd menhom f Google help.
- **US tax info**: Google kat-tlb W-8BEN (individual non-US); khass t3emmrha b s7a7.
- **CAN-SPAM**: l newsletter kat-tlb address postal f footer (ymken PO Box wla virtual mailbox); t2ekd mn l'option l9anouni w l a9al taklifa.
- **Legal pages**: Privacy/Terms/Disclaimer drafts mn template, w t-revi (lawyer ila momkin).
- **Ma t7rqch l budget f paid ads**: $50 l domain + tools khfifa.

## 8. Plan 90 yom (nsha l hadaf: AdSense + awl flous)

| Wa9t        | Chno                                                                                |
| ----------- | ----------------------------------------------------------------------------------- |
| Smana 1-2   | Phase 0 (platform) + USAJOBS key + Gate B/D                                         |
| Smana 2-4   | Phase 1 (ingestion) + Phase 2 (public site)                                         |
| Smana 4-5   | Phase 3: legal pages, About, 15-30 pages (guides sourced + jobs)                    |
| Smana 5-6   | **Apply l AdSense** + Search Console + sitemap                                      |
| Smana 6-10  | Newsletter + custom alerts (Phase 4), guides jdida kol smana, seeding f communities |
| Smana 10-13 | Phase 5: ads placements khfifa, mesure RPM, evaluate                                |

## 9. Questions mfto7a

1. Chno smit l site w domain?
2. A+B wla B wa7do?
3. Budget l Semrush API units wla Google Trends manual l Gate C?
4. Mn ghadi y-review l guides (owner b checklist f `AGENTS.md`)?

## 10. Sources (consulted during research; verify before relying)

- YouTube RPM by country (proxy only, machi website RPM): dynamoi.com/data/youtube-adsense-rpm (us, ca, au)
- Federal hiring situation: govfacts.org (federal hiring freeze 2026), OPM data (data.opm.gov), legalclarity.org
- Moroccan job sites traffic (Semrush/Ahrefs public pages): alwadifa-maroc.com, emploi-public.ma
- Sarkari-style sites in India (Ahrefs public pages): sarkarinetwork.com, examsarkariresult.info
- Germany: Bundesagentur Jobsuche API (community docs: bundesAPI on GitHub; Jentic note that no official OpenAPI spec exists), public-sector job portals (interamt.de and others)
- AdSense help center: support.google.com/adsense (payments, requirements)
- Antigravity rules/AGENTS.md support (third-party documentation): agentpedia.codes
