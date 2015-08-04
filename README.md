Muster
======

A Platform for Ideological Turing Tests - *Can you Pass Muster?*

Ideal System
------------
1. A web form where people submit their essay, and whether or not the essay represents their actual view. If the submitter doesn't want to use an email address, gives the submitter a cookie to identify them on future visits.
2. A webpage (okay in mobile and desktop) that shows successive entries, lets you assign a probability from 10-90 whether the entry was someone's real view, and then shows you whether or not the entry was someone's real view, and the average probability that others assigned to the entry being someone's real view.
3. When you are done with ratings, you are told how well you did compared to population average. Your score is the joint probability you assigned to all entries, i.e., the product of the probability you assigned to the true answer in all cases. You are told what percentage of submitters got a lower score than you.
4. When a submitter returns, they are told how effective their submission was at fooling both the average rater (measured by average probability assigned), and the top quintile of raters (measured by average probability assigned in this subgroup).

Some additional features that would probably also be smart
----------------------------------------------------------
1. Word count limits on entries. You don't want the raters to have to read really long essays, or feel like they're not doing their best if they don't read all of it. Probably also a lower bound to encourage putting enough content in there to judge rather than just repeating common slogans.
2. Scores depending on the number of entries you judge, so those who rate the most entries aren't penalized excessively by doing so. You don't want to just take the geometric mean rather than product, though, since that still rewards those who get lucky in their first few rankings. Either have a "rate at least X many to get on the leaderboard" rule or something fancier like comparing your performance on each entry to the average ranking on that entry.
3. For the writers, I'm not sure how this system would end up treating entries that are completely indecipherable, and therefore would end up with a lot of cheap 50%'s. Maybe you'd need to mess with the 10/90% boundary to reward entries more or less for inspiring the strongest levels of confidence. As it is, one 10% and three 90%'s comes out roughly similar to four 50%'s, i.e. completely fooling one in four is equivalent to being completely indecipherable. You'd have to figure out what sort of ratio you want people to aim for. (I remember doing moderately well in a "two truths and a lie" sort of game by giving statements like "I have been to an odd number of coastal US states" that everyone was just guessing on.)
4. Probably also some sort of algorithm for deciding which entries to present to judges, in which order. I'd start with simple, to get it running, but eventually aim for a thing whose name I'm forgetting that winds up looking like a binary search tree crossed with clustering analysis: present the entry that best divides the set of judges who have previously given similar answers on the entries this judge has already judged.

Possibly Critical Feature
-------------------------
1. An admin page to delete or hide bad entities.
