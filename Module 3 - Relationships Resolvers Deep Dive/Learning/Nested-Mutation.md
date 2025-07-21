# What is a Nested Mutation?

A _nested mutation_ allows you to send related data in a single mutation. Instead of calling `addSkill` and then separately calling `addModule`, you send it all in one mutation and the resolver handles creating both the parent (`Skill`) and its children (`Modules`).

Think of it like:

> "Create a new Skill called **React**, and while you're at it, create it's **Modules** for me too"
