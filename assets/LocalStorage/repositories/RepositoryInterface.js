export class Repository {
    order(result, query) {
        if (!query.orderKey)
            return result; // If no order key is provided, return the array as is.
        const orderKey = query.orderKey;
        return result.sort((a, b) => {
            try {
                const aValue = Number(a[orderKey]);
                const bValue = Number(b[orderKey]);
                if (isNaN(aValue) || isNaN(bValue))
                    throw new Error("Invalid order key");
                return query.orderBy === "asc" ? aValue - bValue : bValue - aValue;
            }
            catch (e) {
                const aValue = String(a[orderKey]);
                const bValue = String(b[orderKey]);
                return query.orderBy === "asc"
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }
        });
    }
    auxAll(localStorage, prefix) {
        const result = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.includes(prefix)) {
                const data = localStorage.getItem(key);
                const parsed = JSON.parse(data);
                parsed.id = Number(parsed.id);
                result.push(parsed);
            }
        }
        return result;
    }
    create(data, localStorage, prefix, last_id) {
        // o id n deve começar em 0
        //@ts-ignore
        data.id = localStorage.getItem(last_id) ?? 1;
        const newId = Number(data.id) + 1;
        localStorage.setItem(last_id, newId.toString());
        localStorage.setItem(prefix + String(data.id), JSON.stringify(data));
        return data;
    }
    update(id, data, localStorage, prefix) {
        if (!localStorage.getItem(prefix + String(id))) {
            return null;
        }
        localStorage.setItem(prefix + String(id), JSON.stringify(data));
        return data;
    }
    delete(id, localStorage, prefix) {
        const data = localStorage.getItem(prefix + String(id));
        if (!data) {
            return false;
        }
        const result = JSON.parse(data);
        if (result.isDeleted)
            return false;
        result.isDeleted = true;
        localStorage.setItem(prefix + String(id), JSON.stringify(result));
        return true;
    }
    find(query, localStorage, prefix) {
        const result = this.auxAll(localStorage, prefix).filter((data) => {
            let isValid = true;
            for (const key in query) {
                if (query[key] !== undefined &&
                    query[key] !=
                        data[key]) {
                    isValid = false;
                }
            }
            return isValid;
        });
        return result[0] || null;
    }
    all(query, localStorage, prefix) {
        const result = this.auxAll(localStorage, prefix).filter((data) => {
            let isValid = true;
            for (const key in query) {
                if (key === "orderKey" || key === "orderBy")
                    continue;
                if (query[key] !== undefined &&
                    query[key] !=
                        data[key]) {
                    isValid = false;
                }
            }
            return isValid;
        });
        return this.order(result, query);
    }
}
//# sourceMappingURL=RepositoryInterface.js.map