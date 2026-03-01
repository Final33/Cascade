import { PastFRQ } from "@/types/frq"

export const apCsFRQs: PastFRQ[] = [
  {
    id: "cs-a-2023-1",
    course: "cs-a",
    year: 2023,
    questionNumber: 1,
    title: "Box of Candy",
    content: `This question involves pieces of candy in a box. The \`Candy\` class represents a single piece of candy.

\`\`\`java
public class Candy
{
    /** Returns a String representing the flavor of this piece of candy */
    public String getFlavor()
    { /* implementation not shown */ }

    // There may be instance variables, constructors, and methods that are not shown.
}
\`\`\`

The \`BoxOfCandy\` class represents a candy box where the candy is arranged in a rectangular grid. The instance variable of the class, \`box\`, is a rectangular two-dimensional array of \`Candy\` objects. A location in the candy box may contain a piece of candy or may be empty. A piece of candy is represented by a \`Candy\` object. An empty location is represented by \`null\`.

You will write two methods of the \`BoxOfCandy\` class.

\`\`\`java
public class BoxOfCandy
{
    /** box contains at least one row and is initialized in the constructor. */
    private Candy[][] box;

    /**
     * Moves one piece of candy in column col, if necessary and possible, so that the box
     * element in row 0 of column col contains a piece of candy, as described in part (a).
     * Returns false if there is no piece of candy in column col and returns true otherwise.
     * Precondition: col is a valid column index in box.
     */
    public boolean moveToFirstRow(int col)
    { /* to be implemented in part (a) */ }

    /**
     * Returns true if there is no piece of candy in column col, false otherwise
     * Precondition: col < box[0].length
     */
    public boolean noCandyInColumn(int col)
    { /* implementation not shown */ }

    // Private instance variables and other methods not shown
}
\`\`\`

(a) Write the \`moveToFirstRow\` method for the \`BoxOfCandy\` class. The method moves one piece of candy in column \`col\` to row 0 of that column, if necessary and possible, as described below:

- If there is no piece of candy in column \`col\`, no action is taken and \`false\` is returned.
- If there is a piece of candy in column \`col\` and row 0 of column \`col\` already contains a piece of candy, no action is taken and \`true\` is returned.
- If there is a piece of candy in column \`col\` and row 0 of column \`col\` does not contain a piece of candy, the piece of candy is moved to row 0 of column \`col\` and \`true\` is returned.`,
    topics: ["Classes", "Arrays", "Methods", "Conditionals"],
    rubric: {
      points: 9,
      criteria: [
        "4 points: moveToFirstRow method implementation",
        "- Correctly checks for candy in column using noCandyInColumn (2 points)",
        "- Properly handles case when row 0 already has candy (2 points)",
        "- Returns correct boolean value (1 point)",
        "5 points: Implementation details",
        "- Correctly moves candy to row 0 when conditions are met (2 points)",
        "- Properly handles all edge cases (2 points)",
        "- Code is well-organized and efficient (1 point)"
      ]
    }
  },
  {
    id: "cs-a-2023-2",
    course: "cs-a",
    year: 2023,
    questionNumber: 2,
    title: "String Manipulation",
    content: `Write a class StringManipulator that contains methods for manipulating strings.

\`\`\`java
public class StringManipulator
{
    /** Returns a new string where all occurrences of oldChar in str
     * are replaced with newChar
     * Precondition: str is not null
     */
    public static String replaceChar(String str, char oldChar, char newChar)
    {
        /* to be implemented in part (a) */
    }

    /** Returns a new string where str is reversed
     * Precondition: str is not null
     */
    public static String reverseString(String str)
    {
        /* to be implemented in part (b) */
    }
}
\`\`\`

(a) Write the replaceChar method that returns a new string where all occurrences of oldChar in str are replaced with newChar. For example:
- replaceChar("hello", 'l', 'w') returns "hewwo"
- replaceChar("good", 'o', 'e') returns "geed"
- replaceChar("java", 'z', 'x') returns "java"

(b) Write the reverseString method that returns a new string where str is reversed. For example:
- reverseString("hello") returns "olleh"
- reverseString("java") returns "avaj"
- reverseString("a") returns "a"`,
    topics: ["String Methods", "Loops", "Static Methods"],
    rubric: {
      points: 9,
      criteria: [
        "4 points: replaceChar method implementation",
        "- Correctly iterates through string (1 point)",
        "- Properly checks each character (1 point)",
        "- Builds new string correctly (1 point)",
        "- Handles edge cases (1 point)",
        "5 points: reverseString method implementation",
        "- Correctly iterates through string (2 points)",
        "- Properly builds reversed string (2 points)",
        "- Returns correct result (1 point)"
      ]
    }
  }
] 