import {
    validateOnlyLetters,
    validateAlphanumeric,
    validateEmail,
    validatePassword,
    validateStartDate, validateRange
} from "./Validations";

it("test for validate only letters values", () => {
    expect(validateOnlyLetters("Aabb")).toEqual(true);
    expect(validateOnlyLetters("")).toEqual(false);
})

it("test for validate alphanumeric values", () => {
    expect(validateAlphanumeric("Aabb115w")).toEqual(true);
    expect(validateAlphanumeric("/")).toEqual(false);
    expect(validateAlphanumeric("sdsdf.*/")).toEqual(false);
})

it("test for validate email", () => {
    expect(validateEmail("Aabb115w@mail.co")).toEqual(true);
    expect(validateEmail("sdsdf.*/")).toEqual(false);
    expect(validateEmail("15")).toEqual(false);
})

it("test for validate password", () => {
    expect(validatePassword("longlongpassword")).toEqual(true);
    expect(validatePassword("small")).toEqual(false);
    expect(validatePassword("15")).toEqual(false);
})

it("test for validate startDate must be small then endDate", () => {
    expect(validateStartDate(new Date("05/05/2005"), new Date("05/05/2008"))).toEqual(true);
    expect(validateStartDate(new Date("05/05/2005"), new Date("05/05/2004"))).toEqual(false);
    expect(validateStartDate(new Date("05/05/2005"), new Date("05/05/2003"))).toEqual(false);
})

it("test for validate range, arguments startDate and endDate must be not included in disabledDates array", () => {
    expect(validateRange([
        {
            startDate: new Date("05/05/2005").valueOf(),
            endDate: new Date("05/05/2008").valueOf()
        }
    ], new Date("05/05/2009").valueOf(), new Date("05/05/2011").valueOf())).toEqual(true);
    expect(validateRange([
        {
            startDate: new Date("05/05/2005").valueOf(),
            endDate: new Date("05/05/2008").valueOf()
        }
    ], new Date("05/05/2003").valueOf(), new Date("05/05/2009").valueOf())).toEqual(false);
    expect(validateRange([
        {
            startDate: new Date("05/05/2005").valueOf(),
            endDate: new Date("05/05/2008").valueOf()
        }
    ], new Date("05/05/2003").valueOf(), new Date("06/05/2008").valueOf())).toEqual(false);
})


