import React, {FC, useCallback, useEffect, useState} from "react";
import {IWorkbookCreateEditProps} from "./IWorkbookCreateEdit";
import {ErrorBoundary} from "../../../../components/errorBoundary/ErrorBoundary";
import ErrorFallback from "../../../../components/errorFallback/ErrorFallback";
import {
    alphanumericPattern,
    emailPattern,
    minBirthDate,
    onlyLettersPattern,
    validateBirthdate,
    validateEmail,
    validateOnlyLetters,
    validatePassport,
} from "../../../../services/validation/Validations";
import "./workbookCreateEdit.css";
import Button from "../../../../components/button/Button";
import {
    checkUniqueness,
    createWorkbook,
    getWorkbook,
    updateWorkbook
} from "../../../../services/workbookApi/workbookApi";
import {notify} from "../../../../services/notify/Notify";
import {IWorkbook} from "../../IWorkBooks";
import Loader from "../../../../components/loader/Loader";
import Input from "../../../../components/input/Input";
import {isEqual} from "lodash-es";
import Calendar from "../../../../components/calendar/Calendar";

const WorkbookCreateEdit: FC<IWorkbookCreateEditProps> = ({
                                                              isCreate,
                                                              id,
                                                              close,
                                                              getData
                                                          }): JSX.Element =>
{
    const initialData = React.useRef<IWorkbook | null>(isCreate ? {
        firstname: "",
        lastname: "",
        email: "",
        passport: "",
        birthdate: 0
    } : null);

    const [workbook, setWorkbook] = useState<IWorkbook | null>(null);
    const [processingSave, setProcessingSave] = useState<boolean>(false);

    // memoization hooks

    const handleChangeInput = useCallback((e: React.ChangeEvent<HTMLInputElement>): void =>
    {
        const {value, name} = e.target;

        setWorkbook(prevWorkbook =>
        {
            return {
                ...prevWorkbook,
                [name]: value.trim()
            } as IWorkbook;
        });
    }, []);

    const handleChangeDate = useCallback((date: Date | null): void =>
    {
        if (date && date instanceof Date)
        {
            setWorkbook(prevWorkbook =>
            {
                return {
                    ...prevWorkbook,
                    birthdate: date?.valueOf() || Date.now
                } as IWorkbook;
            });
        }
    }, []);

    const handleSave = (e: React.MouseEvent<HTMLButtonElement>): void =>
    {
        setProcessingSave(true);
        const {passport = "", email = ""} = workbook || {};
        if (isCreate)
        {
            (async () =>
            {
                try
                {
                    await checkUniqueness({passport, email});
                    await createWorkbook({...workbook as IWorkbook, created_at: Date.now()});
                    setProcessingSave(false);
                    notify("Workbook has created successfully!", "success");
                    getData();
                    close();
                } catch (error)
                {
                    setProcessingSave(false);
                    notify(error.message, "danger");
                }
            })();
        } else if (id)
        {

            const getChangedProperties = (workbook: IWorkbook): Partial<IWorkbook> =>
            {
                let obj: any = {};

                if (workbook && Object.keys(workbook).length && initialData.current)
                {
                    for (const key in workbook)
                    {
                        const keyProp = key as keyof IWorkbook;
                        if (!isEqual(workbook[keyProp], initialData.current[keyProp]))
                        {
                            obj[keyProp] = workbook[keyProp];
                        }
                    }
                }
                return obj;
            };
            const changedObj: Partial<IWorkbook> = getChangedProperties(workbook as IWorkbook);

            (async () =>
            {
                try
                {
                    if (changedObj.email)
                    {
                        await checkUniqueness({email});
                    }
                    if (changedObj.passport)
                    {
                        await checkUniqueness({passport});
                    }
                    await updateWorkbook(id, changedObj);
                    setProcessingSave(false);
                    notify("Document successfully updated!", "success");
                    getData();
                    close();
                } catch (error)
                {
                    setProcessingSave(false);
                    notify(error.message, "danger");
                }
            })();
        }
    };

    // side effects

    useEffect(() =>
    {
        if (isCreate)
        {
            setWorkbook(prevWorkbook => initialData.current);
        } else if (id)
        {
            (async (workbookId) =>
            {
                try
                {
                    const doc = await getWorkbook(workbookId);
                    if (doc.exists)
                    {
                        const data = doc.data() as IWorkbook;
                        initialData.current = data;
                        setWorkbook(prevWorkbook => ({...data}));
                    } else
                    {
                        // doc.data() will be undefined in this case
                        notify("No such document!", "danger");
                    }
                } catch (error)
                {
                    notify(error.message, "danger");
                }
            })(id);
        }
    }, [isCreate, id]);

    const {
        firstname = "",
        lastname = "",
        email = "",
        passport = "",
        birthdate = minBirthDate.valueOf()
    } = workbook || {};

    return (
        <ErrorBoundary fallback={<ErrorFallback/>}>
            <div className={"workBookCreateEditContainer"}>
                <header>
                    <h2>{isCreate ? "Create Workbook" : "Update Workbook"}</h2>
                </header>
                <div className={"workBookCreateEditContent"}>
                    {workbook ? (
                        <>
                            <form>
                                <div>
                                    <Input
                                        type="text"
                                        name="firstname"
                                        label={"Firstname"}
                                        required
                                        value={firstname}
                                        pattern={onlyLettersPattern}
                                        onChange={handleChangeInput}
                                        placeholder="Enter Firstname"
                                        containerStyle={{flex: 1}}
                                        withValidation
                                        isValid={validateOnlyLetters(firstname)}
                                        validationText={"Please insert only letters!"}
                                    />
                                    <Input
                                        type="text"
                                        name="lastname"
                                        label={"Lastname"}
                                        required
                                        value={lastname}
                                        pattern={onlyLettersPattern}
                                        onChange={handleChangeInput}
                                        placeholder="Enter Lastname"
                                        containerStyle={{flex: 1, marginLeft: 20}}
                                        withValidation
                                        isValid={validateOnlyLetters(lastname)}
                                        validationText={"Please insert only letters!"}
                                    />
                                </div>
                                <div>
                                    <Input
                                        type="email"
                                        name="email"
                                        label={"Email"}
                                        required
                                        value={email}
                                        pattern={emailPattern}
                                        onChange={handleChangeInput}
                                        placeholder="Enter Email"
                                        containerStyle={{flex: 1}}
                                        withValidation
                                        isValid={validateEmail(email)}
                                        validationText={"Please insert right email format!"}
                                    />
                                    <Input
                                        type="text"
                                        name="passport"
                                        label={"Passport"}
                                        required
                                        value={passport}
                                        pattern={alphanumericPattern}
                                        onChange={handleChangeInput}
                                        placeholder="Enter Passport"
                                        containerStyle={{flex: 1, marginLeft: 20}}
                                        withValidation
                                        isValid={validatePassport(passport)}
                                        validationText={"Please insert alphanumeric format!"}
                                    />
                                </div>
                            </form>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "0 15px"
                            }}>
                                <label style={{marginRight: 20}} htmlFor={"birthdate"}><b>Birthdate (18+)</b></label>
                                <Calendar
                                    range={false}
                                    className={"inputStyle"}
                                    htmlForName={"birthdate"}
                                    maxDate={minBirthDate}
                                    selected={new Date(birthdate)}
                                    onChange={handleChangeDate}
                                />
                            </div>
                        </>
                    ) : <Loader/>}
                </div>
                <footer>
                    <Button
                        disabled={processingSave}
                        style={{minWidth: 85, backgroundColor: "#dc7d7d"}}
                        onClick={close}
                    >
                        Cancel
                    </Button>
                    {(
                        validateOnlyLetters(firstname) && validateOnlyLetters(lastname) && validateEmail(email) &&
                        validatePassport(passport) && validateBirthdate(new Date(birthdate))) ? (
                        <Button
                            disabled={isEqual(initialData.current, workbook)}
                            processing={processingSave}
                            style={{minWidth: 85, marginLeft: 10}}
                            onClick={handleSave}
                        >
                            Save
                        </Button>
                    ) : null
                    }
                </footer>
            </div>
        </ErrorBoundary>
    );
};

export default WorkbookCreateEdit;
