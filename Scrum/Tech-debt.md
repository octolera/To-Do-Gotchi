# Technical debt

## Technical debt signs

- Code smells
- Absence of automated tests
- Obscure architecture
- Slow toolchain
- Long lived branches
- Inconsistancies with requirements
- Absence of testing envirement
- Long CI/CD cycles

## Code smells

### Unused imports

There was plenty of unused imports in application code base.
Example of unused imports:
![unused-imports](https://github.com/octolera/ToDoGotchi/blob/main/Scrum/unused-import.png)

### Stray 'consloe.log()'

There was a problem with a lot of useless console.log() calls from code debbuging phase.
Example of stray console.log():
![stray-console-logs](https://github.com/octolera/ToDoGotchi/blob/main/Scrum/stray-logs.png)

### Function annotation issue

Some functions need some additional js doc annotations.
Example:
![js-ann](https://github.com/octolera/ToDoGotchi/blob/main/Scrum/js-ann.png)

### Unused variables, states and functions:

Some variables, states and functions are unsued. So we need to clean some stuff.
Example:
![unused-var](https://github.com/octolera/ToDoGotchi/blob/main/Scrum/unused-var.png)

## Absence of automated tests

On this project we are using cypress e2e tests. So there is no problems.

## Obscure architecture

The architecture is prety much straight forward. For additional details see [Arch](https://github.com/octolera/ToDoGotchi/blob/main/Requirements/Arch.md)

## Slow toolchain

Android studio is really slow and heavy. But most of time we can debug and test our application in web browser, thanks to webview.

## Long lived branches

There is a single branch in remote repo.

## Abscense of testing envirement

Any modern web browser will work just fine as test envirement. For additional manual tests we can use few Android based smartphones.

## Long CI/CD cycles

It's to early to say anything about CI/CD
