using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;
using Sirenix.OdinInspector;

public class HealthManager : MonoBehaviour, IDamagable
{
    [SerializeField] private float maxHealth = 100;
    [SerializeField, DisplayAsString] private float currentHealth;

    [SerializeField] private UnityEvent onDeath;
    [SerializeField] private UnityEvent onTakeDamage;

    private void Start()
    {
        currentHealth = maxHealth;
    }

    public void OnTakeDamage(float damage)
    {
        currentHealth -= damage;
        onTakeDamage.Invoke();
        if (currentHealth <= 0) onDeath.Invoke();
    }




}
