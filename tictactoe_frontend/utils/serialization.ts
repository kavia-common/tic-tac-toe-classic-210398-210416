 /*
 ================================================================================
 REQUIREMENT TRACEABILITY
 ================================================================================
 Requirement ID: REQ-TTT-006
 User Story: As a system, I want to record actions with timestamps for traceability.
 Acceptance Criteria: In-memory array with ISO timestamps, actor, and before/after.
 GxP Impact: NO - Demo scaffold; not persistent.
 Risk Level: LOW
 Validation Protocol: VP-TTT-001
 ================================================================================
 */
 import { isRef, toRaw } from 'vue'
 
 /**
  * Detects plain objects (non-null) and arrays to control traversal.
  */
 function isObjectLike(val: unknown): val is Record<string, unknown> | unknown[] {
   return typeof val === 'object' && val !== null
 }
 
 /**
  * Convert Vue reactive proxies/refs into plain values.
  * - Unwrap refs
  * - toRaw for reactive proxies
  * - Recursively clone into JSON-serializable plain structures
  * - Protect against circular references
  */
 // PUBLIC_INTERFACE
 export function toPlainSafe<T>(input: T, seen = new WeakSet<object>()): T {
   /** Convert Vue reactive objects and refs into plain serializable data, guarding circular refs. */
   // unwrap ref
   // @ts-expect-error runtime check
   if (isRef(input)) {
     // @ts-expect-error unwrap
     return toPlainSafe(input.value, seen) as unknown as T
   }
 
   // unwrap reactive proxy
   const raw = isObjectLike(input) ? (toRaw(input as object) as unknown as T) : input
 
   if (!isObjectLike(raw)) {
     return raw
   }
 
   // circular guard
   const asObj = raw as unknown as object
   if (seen.has(asObj)) {
     // replace circular reference with placeholder
     return '[Circular]' as unknown as T
   }
   seen.add(asObj)
 
   if (Array.isArray(raw)) {
     // @ts-ignore
     return (raw as unknown[]).map((v) => toPlainSafe(v, seen)) as unknown as T
   }
 
   const out: Record<string, unknown> = {}
   for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
     try {
       out[k] = toPlainSafe(v as unknown, seen)
     } catch {
       out[k] = `[Unserializable:${typeof v}]`
     }
   }
   return out as unknown as T
 }
 
 /**
  * Safe JSON stringify that first converts to plain structures and catches errors.
  */
 // PUBLIC_INTERFACE
 export function safeStringify(input: unknown, space?: number): string {
   /** Safely stringify potentially reactive/cyclic objects for UI display. */
   try {
     const plain = toPlainSafe(input)
     return JSON.stringify(plain, null, space)
   } catch {
     // last resort: attempt vanilla stringify with replacer to break cycles
     const seen = new WeakSet()
     return JSON.stringify(
       input,
       (key, value) => {
         if (isObjectLike(value)) {
           if (seen.has(value)) return '[Circular]'
           seen.add(value)
         }
         return value
       },
       space,
     )
   }
 }
