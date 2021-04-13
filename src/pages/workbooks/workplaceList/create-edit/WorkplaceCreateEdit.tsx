import React, {FC, useCallback, useEffect, useMemo, useState} from "react";
import {IWorkplaceCreateEditProps} from "./IWorkplaceCreateEdit";
import {ErrorBoundary} from "../../../../components/errorBoundary/ErrorBoundary";
import ErrorFallback from "../../../../components/errorFallback/ErrorFallback";
import {IWorkplace} from "../list/IWorkplaceList";
import {createWorkplace, getWorkplace, updateWorkplace} from "../../../../services/workplaceApi/workplaceApi";
import {notify} from "../../../../services/notify/Notify";
import Input from "../../../../components/input/Input";
import Button from "../../../../components/button/Button";
import {isEqual} from "lodash-es";
import Loader from "../../../../components/loader/Loader";
import CountrySelector from "../../../../components/countrySelector/CountrySelector";
import "./workplaceCreateEdit.css";
import Calendar from "../../../../components/calendar/Calendar";

const WorkplaceCreateEdit: FC<IWorkplaceCreateEditProps> = ({
    isCreate,
    id,
    workBookId,
    usedDates,
    close,
    getData
}): JSX.Element =>
{
    const initialData = React.useRef<IWorkplace | null>(isCreate ? {
        company: "",
        country: "",
        workbookId: workBookId,
        startDate: null,
        endDate: null
    } : null);
    const [workplace, setWorkplace] = useState<IWorkplace | null>(null);
    const [processingSave, setProcessingSave] = useState<boolean>(false);

    // memoization hooks

    const disabledDates = useMemo(() =>
    {
        return usedDates.filter(date => date.id !== id);
    }, [usedDates, id]);

    const getChangedProperties = (workplace: IWorkplace): Partial<IWorkplace> =>
    {
        let obj: any = {};

        if (workplace && Object.keys(workplace).length && initialData.current)
        {
            for (const key in workplace)
            {
                const keyProp = key as keyof IWorkplace;
                if (!isEqual(workplace[keyProp], initialData.current[keyProp]))
                {
                    obj[keyProp] = workplace[keyProp];
                }
            }
        }
        return obj;
    };

    const handleChangeInput = useCallback((e: React.ChangeEvent<HTMLInputElement>): void =>
    {
        const {value, name} = e.target;

        setWorkplace(prevWorkplace => {
            return {
                ...prevWorkplace,
                [name]: value
            } as IWorkplace
        })
    },[]);

    const handleChangeStartDate = useCallback((date: Date | null): void =>
    {
        setWorkplace(prevWorkplace => {
            return {
                ...prevWorkplace,
                startDate: date?.valueOf() || null
            } as IWorkplace
        })
    },[]);

    const handleChangeEndDate = useCallback((date: Date | null): void =>
    {
        setWorkplace(prevWorkplace => {
            return {
                ...prevWorkplace,
                endDate: date?.valueOf() || null
            } as IWorkplace
        })
    },[]);

    const handleChangeCountry = useCallback((value: string): void =>
    {
        setWorkplace(prevWorkplace => {
            return {
                ...prevWorkplace,
                country: value.trim()
            } as IWorkplace
        })
    },[]);

    const handleSave = (e: React.MouseEvent<HTMLButtonElement>): void =>
    {
        setProcessingSave(true);
        if(isCreate)
        {
            (async () => {
                try {
                    await createWorkplace({...workplace as IWorkplace, created_at: Date.now()});
                    setProcessingSave(false);
                    notify("Workplace has been successfully created!", "success");
                    getData();
                    close();
                }catch (error) {
                    setProcessingSave(false);
                    notify(error.message, "danger")
                }
            })()
        }
        else {
            if (id)
            {
                const changedObj: Partial<IWorkplace> = getChangedProperties(workplace as IWorkplace);

                (async () => {
                    try {
                        await updateWorkplace(id, changedObj);
                        setProcessingSave(false);
                        notify("Document successfully updated!", "success");
                        getData();
                        close();
                    }catch (error) {
                        setProcessingSave(false);
                        notify(error.message, "danger")
                    }
                })()
            }
        }
    };

    // side effects

    useEffect(() =>
    {
        if (isCreate)
        {
            setWorkplace(prevWorkplace => initialData.current);
        }
        else if (id)
        {
            (async (workplaceId) => {
                try {
                    const doc = await getWorkplace(workplaceId);
                    if (doc.exists)
                    {
                        const data = doc.data() as IWorkplace;
                        initialData.current = data;
                        setWorkplace(prevWorkplace => ({...data}));
                    } else
                    {
                        // doc.data() will be undefined in this case
                        notify("No such document!", "danger");
                    }
                }catch (error) {
                    notify(error.message, "danger")
                }
            })(id)
        }
    }, [isCreate, id]);

    const {company = "", country, endDate = null, startDate = null} = workplace || {};
    return (
        <ErrorBoundary fallback={<ErrorFallback />}>
            <div className={"workPlaceCreateEditContainer"}>
                <header>
                    <h2>{(isCreate ? "Create" : "Update") + " Workplace"}</h2>
                </header>
                <div className={"workPlaceCreateEditContent"}>
                    {workplace ? (
                        <>
                            <form>
                                <Input
                                    type="text"
                                    name="company"
                                    label={"Company"}
                                    required
                                    value={company}
                                    onChange={handleChangeInput}
                                    placeholder="Enter company name"
                                />
                                <CountrySelector
                                    label={"Country"}
                                    country={country}
                                    onChange={handleChangeCountry}
                                />
                            </form>
                            <div className={"dateRangeContainer"}>
                                <label style={{marginRight: 20}} htmlFor={"birthdate"}><b>Birthdate (18+)</b></label>
                                <Calendar
                                    range={true}
                                    disabledRangeDates={disabledDates}
                                    className={"inputStyle"}
                                    htmlForName={"rangePicker"}
                                    start={startDate ? new Date(startDate) : null}
                                    end={endDate ? new Date(endDate) : null}
                                    onChangeStartDate={handleChangeStartDate}
                                    onChangeEndDate={handleChangeEndDate}
                                />
                            </div>
                        </>
                    ) : <Loader />}
                </div>
                <footer>
                    <Button
                        disabled={processingSave}
                        style={{minWidth: 85, backgroundColor: "#dc7d7d"}}
                        onClick={close}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isEqual(initialData.current, workplace)}
                        processing={processingSave}
                        style={{minWidth: 85, marginLeft: 10}}
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                </footer>
            </div>
        </ErrorBoundary>
    );
};

export default WorkplaceCreateEdit;