// A small set of original whodunits, written for this app, so the Detective
// Stories section always has something to read even when the network is
// unavailable — bundled with the app, zero fetch required. These are NOT
// excerpts of anyone else's work; they're original fiction in the classic
// detective style, clearly labeled as such below. The live "Poll for new
// stories" button still tries to pull genuine public-domain texts from
// Project Gutenberg and Wikisource on top of these.

import type { NewStory } from './stories'

const AUTHOR = 'Mental Wellness Originals'
const SOURCE = 'Written for this app — not a historical text'

export const SEED_STORIES: NewStory[] = [
  {
    title: 'The Vanishing Violinist',
    author: AUTHOR,
    source: SOURCE,
    url: '',
    text: `Adrian Voss had a habit of receiving news of the impossible over breakfast, and it rarely improved his appetite. That Tuesday it was a telegram from the Thornfield Concert Hall: their star violinist, Elena Ricci, had walked into her dressing room fifteen minutes before curtain and simply never walked out. The door had been watched the entire time by a stagehand posted directly outside it. The single window, four floors up, was painted shut and hadn't been opened in a decade. And yet the room, when they finally broke down the door at the top of the hour, was empty.

"A woman does not evaporate, Marsh," Voss said to me as our cab rattled toward the hall. "She either left through a way we haven't found, or she never truly arrived in the way we assume."

The dressing room was small and spare: a mirror ringed with electric bulbs, a costume rail, a violin case lying open and empty on the table, and a single chair. Voss did not so much examine the room as interrogate it. He ran a finger along the window frame — thick with old paint, undisturbed. He measured the gap beneath the door with a matchstick — too narrow for anything but a folded note. He spent a long minute simply standing in the centre of the room, turning slowly, as though the answer might be written on the walls in a hand only he could read.

"The stagehand," Voss said at last. "Bring him."

The young man, Thomas, was pale and certain of himself in the particular way of someone who has told the same story so many times it has started to feel like the truth rather than merely being it. He had stood outside the door the whole quarter hour, he said. He had heard Miss Ricci moving about inside — footsteps, the creak of the chair, once the soft complaint of a violin string being tuned. He had knocked twice to warn her of the time. Both times she had answered, "Two minutes."

"You never once looked inside?"

"I didn't need to, sir. I could hear her."

Voss's eyes had taken on the particular brightness I had learned to associate with the moment a case stopped being a mystery and became merely a matter of proof. He asked to see the violin case again, then the costume rail, and finally — to the theatre manager's visible bewilderment — the room directly above the dressing room, which turned out to be a small storage loft used for spare scenery flats.

In the corner of that loft, behind a rolled backdrop, Voss found a coil of thin rope and, more tellingly, a second violin — a cheap practice instrument, not Miss Ricci's Guarnerius — with a device fastened crudely to its body: a small clockwork mechanism, the kind used in music boxes, rigged to pluck a single string on a timer and to tap two wooden dowels against the floor at intervals, mimicking a footstep.

"She was never in that room after the first five minutes," Voss said. "The sounds Thomas heard were manufactured — a wind-up toy doing an actress's work. And when he knocked, it wasn't Miss Ricci who answered 'two minutes.' It was someone standing just inside, close enough to speak through the door and slip out through the floor hatch the moment his footsteps retreated." He tapped the boards beneath our feet, and sure enough, a section lifted on a hinge, leading to a narrow maintenance stair that ran down the back of the building, entirely unwatched.

The truth, once Voss laid it before the theatre manager, was almost gentle by the standards of his cases: Miss Ricci's understudy, desperate for a chance to play the season's most coveted solo, had arranged with a sympathetic props master to stage the disappearance, intending to "discover" that Miss Ricci had fled from stage fright and to step into the role herself that very night. Miss Ricci, for her part, had been persuaded — with a promise of money she badly needed — to simply leave by the hatch and wait it out at a nearby inn, never told quite how her absence would be explained.

"No violence, then," I said, relieved despite myself.

"No," Voss agreed, closing his watch. "Only ambition, dressed up as a mystery because ambition alone rarely gets anyone's attention. People will forgive almost any story, Marsh, provided it comes with a locked door."`,
  },
  {
    title: "The Clockmaker's Alibi",
    author: AUTHOR,
    source: SOURCE,
    url: '',
    text: `The body of Edmund Coyle was found in his own workshop at a quarter past nine, surrounded by more clocks than I have ever seen assembled in one room, every one of them — Adrian Voss would later establish with some satisfaction — keeping perfect and identical time. He had been struck once, from behind, with a heavy iron loupe stand that normally sat on his workbench. The workshop door locked from the inside with a bolt that had been thrown; the only other way in was a service door at the rear, which Coyle's apprentice, a sullen young man named Pryce, swore he had locked himself at six that evening and not touched since.

Three people had reason to want Edmund Coyle dead, and all three had an alibi built, in some fashion, on his own clocks.

His business partner, Mrs. Hale, claimed she had been at the opera until half past nine, and produced a ticket stub to prove it — timed by the very clock tower outside the workshop, which Coyle himself had built and maintained. His nephew, who stood to inherit the workshop and its considerable patents, swore he had been dining at his club until nine, an alibi confirmed by the club's own longcase clock, serviced by Coyle not a fortnight before. And Pryce, the apprentice, insisted he'd left promptly at six and gone directly home, where his landlady would vouch he was in by half past — she had checked the mantel clock, which, naturally, Coyle had given her as a wedding gift some years before.

"How convenient," I remarked, "that every alibi in this case rests on a clock that the dead man built."

"Not convenient, Marsh," said Voss, crouching by the body with his glass. "Suspicious. A man who builds clocks for a living is uniquely positioned to know exactly how far each of them can be trusted to lie."

He spent the better part of an hour among the workshop's instruments before he found what he wanted: a small logbook, half-hidden beneath a drawer lining, in which Coyle had recorded — in a private shorthand it took Voss some minutes to unpick — the actual running rate of every clock he had built or serviced in the past year, set against the true time kept by his own master regulator, the one clock in the room he trusted absolutely. The opera house tower ran four minutes fast. The club's longcase ran six minutes slow. The landlady's mantel clock, the most recent gift, ran a full eleven minutes fast — deliberately so, Voss judged, since eleven minutes was suspiciously exact for a clock otherwise kept in careful repair.

"He knew," Voss said, "precisely how unreliable each of these timepieces was, because he had made them that way, or found them that way and never corrected the fault. A man planning to be elsewhere at the hour of his own convenience need only consult a clock he knows to be wrong, and let it testify for him."

The logbook alone proved nothing but Coyle's private cynicism. What it gave Voss was a set of true correction figures — and with those, an alibi that had looked solid dissolved rather quickly. Pryce's landlady's clock, corrected by eleven minutes, put the apprentice arriving home not at half past six but at nineteen minutes past — a full eleven minutes after Pryce claimed to have left the workshop, which was not, on its own, damning. But it was the opposite correction, applied to the workshop's own master regulator beside the body, that mattered more: it had stopped, cracked from the same blow that killed its maker, at six minutes past six. Not nine fifteen, as the household had assumed from the state of the body and the coroner's early estimate. Pryce's alibi, once honestly timed, put him at home at nineteen minutes past six — a full thirteen minutes after the true hour of the murder, not after it as he'd hoped anyone would assume, but comfortably, damningly, before it could have been anyone else.

"He never left at six," Voss said quietly. "He left after killing his master, and set the workshop clocks — all but the one he didn't dare touch — to support a story built on an hour that never existed as he described it."

Pryce did not deny it long, once shown his own late employer's meticulous, secret arithmetic. He had wanted, it emerged, nothing more dramatic than his master's blessing to court Coyle's daughter, and had been refused with a cruelty he could not forgive. "Everyone always trusted his clocks," Pryce said bitterly, as they led him away. "I only thought to use that."

"So did he," Voss said. "That is generally how a man's own cleverness comes round to convict him."`,
  },
  {
    title: 'A Puzzle in Porcelain',
    author: AUTHOR,
    source: SOURCE,
    url: '',
    text: `It was, Adrian Voss admitted afterward, one of the smallest thefts he had ever been asked to investigate, and one of the most instructive. A single porcelain figurine — a shepherdess, no taller than a hand, worth perhaps thirty pounds to a collector and a great deal more to its owner, an elderly widow named Mrs. Abbot who had kept it on her mantel since her husband gave it to her forty years before — had vanished from a locked display cabinet during a small dinner party of six guests, all of whom Mrs. Abbot considered, with evident distress, to be her friends.

"I don't care about the thirty pounds," she told us, twisting her handkerchief. "I care that one of them took it, and smiled at me over dessert while they did."

The cabinet had a simple lock, easily defeated by anyone with a hairpin and a moment's privacy, and every guest had, at some point in the evening, been alone in the drawing room where it stood — fetching a shawl, admiring the garden through the window, or simply arriving early and waiting for the others. There were no witnesses, no fingerprints of any use, and by the time Voss arrived the following morning, five of the six guests had already sent notes expressing their horror at the theft and their eagerness to help however they could.

Voss read each note twice.

"People rarely lie well in writing," he said. "They plan their spoken alibis with care and forget that a letter is also a kind of testimony." He laid the five notes side by side on Mrs. Abbot's dining table. Four were conventional expressions of sympathy. The fifth, from a Mr. Pemberton, a younger cousin of one of the other guests, included a curious detail: he hoped the "little shepherdess" would be found soon, and mentioned, in passing, how fond he had always been of "her painted blue cloak."

"Mrs. Abbot," Voss said, "was the figurine's cloak blue?"

She blinked. "No. It was rose-coloured. It has always been rose-coloured."

"Then Mr. Pemberton has described a piece he has never actually seen up close — which is exactly what an honest guest, glancing at it across a room, might easily misremember. It is also exactly what a guilty man might write if he wished to seem familiar with an object he had, in fact, examined intently enough to plan its theft, and then invented a false memory to seem innocently vague instead of suspiciously precise."

I confess I found this thinner ice than Voss's usual proofs, and said so.

"You're quite right, Marsh, it proves nothing by itself. It only tells me where to look harder." He asked Mrs. Abbot for a full guest list with occupations, and stopped at once on learning that Mr. Pemberton dealt, in a small way, in antique china — a fact his cousin had mentioned proudly and Pemberton himself had not thought to volunteer.

A visit to Pemberton's shop turned up no figurine on display, which Voss had rather expected; a man foolish enough to steal from a dinner party is rarely foolish enough to display the proceeds by his till. But in the shop's back room, among ledgers of purchases and sales, Voss found a recent entry: a "rose shepherdess, minor hairline crack to base, provenance unclear" sold three days after Mrs. Abbot's party to a collector two counties away, for considerably more than thirty pounds.

"The crack to the base," Voss said afterward, "is what undid him rather more than the blue cloak. Mrs. Abbot's figurine had no such crack when it left her cabinet. Mr. Pemberton, in the business of small deceptions about provenance, gave himself away by inventing a flaw to explain why he'd sold a treasured heirloom so quickly and so far from home — a story so ordinary for his trade that he never thought anyone would ask who had owned it first."

Confronted with the ledger, Pemberton did not so much confess as simply stop pretending, with the particular relief of a man who has been performing innocence rather badly and is glad to be done with it. The figurine itself, alas, could not be recovered before its new owner had it shipped abroad; but Mrs. Abbot received, some months later, a small settlement from Pemberton's mortified family, and told Voss she would gladly have traded every penny of it for the truth alone.

"Most people would say the same," Voss remarked, as we left. "Very few of them mean it quite as sincerely as she did."`,
  },
  {
    title: 'The Garden Party Cipher',
    author: AUTHOR,
    source: SOURCE,
    url: '',
    text: `The note that brought Adrian Voss to Lord Aldous Fenwick's garden party was, on its face, nothing more than an invitation — until one noticed that every fourth word had been very lightly underlined in pencil, so faintly that I had read it twice before I saw the pattern at all. Strung together, the underlined words read: COME ALONE SOMEONE HERE MEANS ME HARM.

Fenwick, when we found him among his roses, denied writing any such thing, and seemed genuinely baffled by the suggestion — which convinced Voss at once that the message was real, since a man inventing a threat against himself rarely bothers to look so thoroughly unconvinced by it.

"Then someone sent it in your name," Voss said, "using your own invitations as cover, confident that whoever received it would come to the party regardless and never think to ask who had truly written the message hidden inside it."

The party itself was a modest affair: perhaps a dozen guests taking tea on the lawn, all known to Fenwick, all ordinary enough on their faces. Voss moved among them without any evident urgency, admiring the garden, complimenting the sandwiches, and asking each guest, in the most idle tone imaginable, whether they had received an invitation by the morning or the evening post.

It was a strange question, and only I seemed to notice that he asked it of everyone.

Nine guests had received their invitations that morning. Two had received theirs the previous evening. The twelfth, a quiet young woman named Miss Hartley who worked as Fenwick's secretary, said she hadn't received an invitation at all — she simply came each week as part of her duties.

"She wrote the invitations," Voss said to me quietly, once we had stepped away. "Which means she is the one person here who could underline a word on every single card before they were sent, and know precisely which guest would receive which cipher, without any risk of the message being noticed by Fenwick himself, who never reads his own outgoing post."

But a secretary who wished someone harm could simply act, Voss reasoned, without warning them first in pencil. The cipher wasn't a threat aimed outward. It was aimed at one particular guest, warning them — which meant Miss Hartley had written it not as the danger, but as someone trying, quietly and at some personal risk, to protect somebody else.

Voss asked her directly, and after a long moment watching the tea being poured, she admitted it. She had overheard Fenwick's business partner, a Mr. Carrow, quietly threatening another guest — a Mrs. Iris Doyle, recently returned from abroad — in the estate's study two days before, over a matter of money Doyle apparently knew enough about to ruin him. Miss Hartley had not dared tell anyone outright, fearing Carrow's temper and her own position in the household, but she could not in good conscience let Mrs. Doyle walk into a garden party beside the man threatening her without any warning at all. So she had done the only thing that felt safe: hidden a warning in plain sight, inside an invitation Carrow himself had no reason to examine closely.

"She gambled that Mrs. Doyle would notice what Carrow would not," Voss said. "A fair gamble, as it turned out — Mrs. Doyle read it aloud to me not ten minutes ago, quite by chance, thinking it an odd little riddle worth sharing over tea."

Confronted gently and in private, Carrow did not deny the threat, though he insisted — perhaps truthfully, perhaps not — that he had never intended to act on it. Fenwick, appalled that such a conversation had taken place under his own roof, asked Carrow to leave before the sandwiches were finished, and thanked Miss Hartley with considerably more warmth than her modest position at his household usually earned her.

"No murder, no theft, not even a proper crime by the letter of the law," I said, as we walked back down the drive. "Rather a quiet case, for you."

"The quiet ones are often the ones that matter most, Marsh," Voss said. "Most people who mean harm are stopped, if they're stopped at all, not by detectives, but by someone ordinary enough to notice in time, and brave enough to say so — even in pencil, even sideways, even at a garden party where saying it plainly felt impossible."`,
  },
]
