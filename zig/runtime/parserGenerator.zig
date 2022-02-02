const std = @import("std");

const p = @import("./parser.zig");
const Error = p.Error;
const Parser = p.Parser;

const l = @import("./literal.zig");
const Literal = l.Literal;

pub fn OneOf(comptime Value: type, comptime Reader: type) type {
    return struct {
        parser: Parser(Value, Reader) = .{
            ._parse = parse,
        },
        parsers: []*Parser(Value, Reader),

        const Self = @This();

        pub fn init(parsers: []*Parser(Value, Reader)) Self {
            return Self{
                .parsers = parsers,
            };
        }

        inline fn parse(parser: *Parser(Value, Reader), allocator: *std.mem.Allocator, src: *Reader) Error!?Value {
            const self = @fieldParentPtr(Self, "parser", parser);

            for (self.parsers) |one_of_parser| {
                const result = try one_of_parser.parse(allocator, src);

                if (result != null) {
                    return result;
                }
            }

            return null;
        }
    };
}

test "OneOf" {
    var allocator = std.testing.allocator;
    var reader = std.io.fixedBufferStream("catttt");

    var one_of = OneOf([]u8, @TypeOf(reader)).init(&.{
        &Literal(@TypeOf(reader)).init("dog").parser,
        &Literal(@TypeOf(reader)).init("sheep").parser,
        &Literal(@TypeOf(reader)).init("cat").parser,
    });

    var result = try (&one_of.parser).parse(&allocator, &reader);

    try std.testing.expectEqualStrings("cat", result.?);

    if (result) |r| {
        allocator.free(r);
    }
}
