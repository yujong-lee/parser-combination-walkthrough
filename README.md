# Parser Combination Walkthrough

>  In short, if you need to build a parser, but you don’t actually want to, a parser combinator may be your best option. - [Parsing in JavaScript: Tools and Libraries](https://tomassetti.me/parsing-in-javascript/#parserCombinators)

Parser combination is "just awesome" and it works perfectly with TDD flow.

- `/js`
    + `/basic`
    
        Simple arithmetic expression evaluation. I read [Introduction-to-parser-combinators](https://gist.github.com/yelouafi/556e5159e869952335e01f6b473c4ec1), and wrote it from scratch.
    
    + `/advance`
    
        Learned from [pcomb](https://github.com/yelouafi/pcomb). Will be added.

    + TODO
        - Remember [some limitations](https://gist.github.com/yelouafi/556e5159e869952335e01f6b473c4ec1#there-is-much-more) in `./basic`.
            + `Modular interfaces` : Top priority. Like monad transformers in [Haskell](https://en.wikibooks.org/wiki/Haskell/Monad_transformers).
            + `Lookahead` : Can be implemented with my previous study in [this book](http://www.yes24.com/Product/Goods/103157156).
            + `User state` : I have no idea yet. Can be done alongside with `Lookahead`.
        - Add more in `/advance`.
        - Read [Parsing in JavaScript: Tools and Libraries](https://tomassetti.me/parsing-in-javascript/#parserCombinators), [fantasy-land](https://github.com/fantasyland/fantasy-land), [bennu](https://github.com/mattbierner/bennu), and [parsimmon](https://github.com/jneen/parsimmon).

- `/zig`
    + `/runtime`

        Leaned from [zig-parser-combinators-and-why-theyre-awesome](https://devlog.hexops.com/2021/zig-parser-combinators-and-why-theyre-awesome).
    + TODO
        - [Compiletime parser generation](https://github.com/Hejsil/mecha)
        - [Hacker News thread](https://news.ycombinator.com/item?id=26416531)

- `/haskell`

    TBD
